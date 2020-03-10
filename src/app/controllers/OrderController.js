import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import * as Yup from 'yup';

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

    //create Orders
    const { product_name, recipient_id, deliveryman_id } = await Order.create(
      req.body
    );

    return res.json({
      product_name,
      recipient_id,
      deliveryman_id,
    });
  }
}

export default new OrderController();
