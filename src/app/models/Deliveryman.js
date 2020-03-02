import Sequelize, { Model } from 'sequelize';

class Deliveryman Model {
  static connectToDatabase(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Deliveryman;
