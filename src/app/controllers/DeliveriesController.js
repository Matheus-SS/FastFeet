import Order from '../models/Order';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import { Op } from 'sequelize';
import { isAfter, parseISO } from 'date-fns';
import * as Yup from 'yup';

class DeliveriesController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Order.finddAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        end_date: {
          [Op.not]: null,
        },
      },
      attributes: [
        'id',
        'product_name',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'name', 'path'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'avatar_id', 'email'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.string().required(),
      signature_id: Yup.number()
        .required()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const { end_date, signature_id } = req.body;
    const endDate = parseISO(end_date);

    const result = isAfter(endDate, order.start_date);

    if (!result) {
      return res
        .status(400)
        .json({ error: 'End date must be after start date' });
    }

    order.signature_id = signature_id;
    order.end_date = end_date;

    await order.save();

    return res.json({
      signature_id,
      end_date,
    });
  }
}

export default new DeliveriesController();
