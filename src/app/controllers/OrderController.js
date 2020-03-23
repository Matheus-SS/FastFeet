import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

import * as Yup from 'yup';

import OrderRegistrationMail from '../jobs/OrderRegistrationMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product_name: Yup.string().required(),
      recipient_id: Yup.number()
        .required()
        .integer()
        .positive(),
      deliveryman_id: Yup.number()
        .required()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    //checks if does not exists a recipient with the id that is on req.body
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    //checks if does not exists a deliveryman with the id that is on req.body
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    // create Orders
    const { product_name } = await Order.create(req.body);

    await Queue.addJobs(OrderRegistrationMail.key, {
      deliveryman,
      recipient,
      product_name,
    });

    return res.json({
      product_name,
      recipient_id,
      deliveryman_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product_name: Yup.string().required(),
      recipient_id: Yup.number()
        .integer()
        .positive(),
      deliveryman_id: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { recipient_id, deliveryman_id, product_name } = req.body;

    const order = await Order.findByPk(req.params.id);

    //checks if does not exists a order with the id that is on params
    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const recipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    //checks if does not exists a recipient with the id that is on req.body
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    //checks if does not exists a deliveryman with the id that is on req.body
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    // it will send email only if the deliveryman or recipient change
    if (
      deliveryman_id !== order.deliveryman_id ||
      recipient_id !== order.recipient_id
    ) {
      await Queue.addJobs(OrderRegistrationMail.key, {
        deliveryman,
        recipient,
        product_name,
      });
    }

    // update Orders
    await order.update(req.body);

    return res.json({
      product_name,
      recipient_id,
      deliveryman_id,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveryman = await Order.findAll({
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

    return res.json(deliveryman);
  }

  async show(req, res) {
    const deliveryman = await Order.findByPk(req.params.id, {
      attributes: [
        'id',
        'product_name',
        'canceled_at',
        'start_date',
        'end_date',
      ],
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

    if (!deliveryman) {
      return res.status(400).json({ error: 'Order does not exists' });
    }
    return res.json(deliveryman);
  }

  async delete(req, res) {
    const deliveryman = await Order.findByPk(req.params.id, {
      attributes: [
        'id',
        'product_name',
        'canceled_at',
        'start_date',
        'end_date',
      ],
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

    if (!deliveryman) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    await deliveryman.destroy();

    return res.json(deliveryman);
  }
}

export default new OrderController();
