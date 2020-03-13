import Order from '../models/Order';
import { Op } from 'sequelize';

class PendingDeliveryController {
  async index(req, res) {
    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        [Op.or]: {
          end_date: {
            [Op.not]: null,
          },
          canceled_at: {
            [Op.not]: null,
          },
        },
      },
    });

    return res.json(deliveries);
  }
}

export default new PendingDeliveryController();
