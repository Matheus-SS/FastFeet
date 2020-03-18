import Problem from '../models/Problem';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import CancelationDelivery from '../jobs/CancelationDelivery';

class ProblemController {
  async create(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const problem = await Problem.create({
      description: req.body.description,
      delivery_id: req.params.orderId,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const problem = await Problem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(problem);
  }

  async show(req, res) {
    const problem = await Problem.findAll({
      where: { delivery_id: req.params.orderId },
    });

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    return res.json(problem);
  }

  async delete(req, res) {
    const problem = await Problem.findByPk(req.params.problemId);

    if (!problem) {
      return res.status(400).json({ error: 'Problem does not exists' });
    }

    const order = await Order.findByPk(problem.delivery_id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order already canceled' });
    }

    const deliveryman = await Deliveryman.findByPk(order.deliveryman_id);

    order.canceled_at = new Date();

    await order.save();

    await Queue.addJobs(CancelationDelivery.key, {
      deliveryman,
    });

    return res.json(order);
  }
}
export default new ProblemController();
