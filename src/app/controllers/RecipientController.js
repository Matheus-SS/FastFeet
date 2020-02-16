import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .positive()
        .required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const recipientClone = req.body;

    //checks if there is a recipient equal to the one that will be saved
    const recipientExist = await Recipient.findOne({
      where: {
        name: recipientClone.name,
        street: recipientClone.street,
        number: recipientClone.number,
        complement: recipientClone.complement,
        state: recipientClone.state,
        city: recipientClone.city,
        zip_code: recipientClone.zip_code,
      },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      address: {
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number()
        .integer()
        .positive(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const recipientClone = req.body;
    //checks if there is a recipient equal to the one that will be updated
    const recipientExist = await Recipient.findOne({
      where: {
        name: recipientClone.name,
        street: recipientClone.street,
        number: recipientClone.number,
        complement: recipientClone.complement,
        state: recipientClone.state,
        city: recipientClone.city,
        zip_code: recipientClone.zip_code,
      },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      address: {
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      },
    });
  }

  async index(req, res) {
    const recipient = await Recipient.findAll();

    return res.json(recipient);
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }
    return res.json(recipient);
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    await recipient.destroy();

    return res.json(recipient);
  }
}
export default new RecipientController();
