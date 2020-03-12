import Mail from '../../lib/Mail';

class OrderRegistrationMail {
  get key() {
    return 'OrderRegistrationMail';
  }

  async handleEmailQueue({ data }) {
    const { deliveryman, recipient, product_name } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}`,
      subject: 'Produto disponível para retirada',
      template: 'orderRegistration',
      context: {
        deliveryman_name: deliveryman.name,
        recipient_name: recipient.name,
        recipient_street: recipient.street,
        recipient_number: recipient.number,
        recipient_city: recipient.city,
        recipient_state: recipient.state,
        recipient_zipCode: recipient.zip_code,
        recipient_complement: recipient.complement,
        product_name: product_name,
      },
    });
  }
}

export default new OrderRegistrationMail();
