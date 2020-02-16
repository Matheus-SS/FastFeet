import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store (req, res) {
    const schema = Yup.object ().shape ({
      name: Yup.string ().required (),
      street: Yup.string ().required (),
      number: Yup.number ().integer ().positive ().required (),
      complement: Yup.string ().required (),
      state: Yup.string ().required (),
      city: Yup.string ().required (),
      zip_code: Yup.string ().required (),
    });

    if (!await schema.isValid (req.body)) {
      return res.status (400).json ({error: 'Validation failed'});
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create (req.body);

    return res.json ({
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

  async update (req, res) {
    const recipient = await Recipient.findByPk (req.params.id);
    // testar se exist recipient igual usar isEqual
    if (!recipient) {
      return res.status (400).json ({error: 'Recipient does not exists'});
    }
    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update (req.body);

    return res.json ({
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
}
export default new RecipientController ();
