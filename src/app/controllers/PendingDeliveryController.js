import Order from '../models/Order';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import { Op } from 'sequelize';

class PendingDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        [Op.or]: {
          end_date: null,
          canceled_at: {
            [Op.not]: null,
          },
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
}

export default new PendingDeliveryController();
