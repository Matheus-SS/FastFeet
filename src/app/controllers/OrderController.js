import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import * as Yup from 'yup';

import Mail from '../../lib/Mail';

class OrderController {
  async store(req, res) {
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

    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    //checks if does not exists a recipient with the id that is on req.body
    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    //checks if does not exists a deliveryman with the id that is on req.body
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    // create Orders

    const { product_name } = await Order.create(req.body);

    await Mail.sendMail({
      to: `${deliverymanExists.name} <${deliverymanExists.email}`,
      subject: 'Produto disponível para retirada',
      text: 'Produto pronto para entrega',
    });

    return res.json({
      product_name,
      recipient_id,
      deliveryman_id,
    });
  }
}

export default new OrderController();
