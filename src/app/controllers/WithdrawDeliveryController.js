import Order from '../models/Order';
import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  parseISO,
  setHours,
  format,
  setSeconds,
  setMinutes,
  isWithinInterval,
} from 'date-fns';

class WithdrawDeliveryController {
  async update(req, res) {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    // const { date } = req.query;

    const date = parseISO(req.body.start_date);

    //count the amount of orders of the deliveryman
    const amount = await Order.count({
      where: {
        deliveryman_id: order.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (amount >= 5) {
      return res.status(400).json({ error: 'Only 5 withdrawals per day' });
    }

    const searchDate = Number(date);

    const schedule = ['08:00', '18:00'];

    // format schedule to a valid date
    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      return format(value, "yyyy-MM-dd'T'HH:mm:ssxxx");
    });

    /**Return true if the interval is between the first
     and end date of schedule **/
    const result = isWithinInterval(searchDate, {
      start: parseISO(available[0]),
      end: parseISO(available[1]),
    });

    if (!result) {
      return res
        .status(400)
        .json({ error: 'Pick-up time between 08:00 and 18:00' });
    }
    const { start_date } = await order.update(req.body);
    return res.json(order);
  }
}
export default new WithdrawDeliveryController();
