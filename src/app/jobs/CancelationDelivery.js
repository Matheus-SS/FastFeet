import Mail from '../../lib/Mail';

class CancelationDelivery {
  get key() {
    return 'CancelationDelivery';
  }

  async handleEmailQueue({ data }) {
    const { deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}`,
      subject: 'Cancelamento encomenda',
      template: 'cancelDelivery',
      context: {
        deliveryman_name: deliveryman.name,
      },
    });
  }
}

export default new CancelationDelivery();
