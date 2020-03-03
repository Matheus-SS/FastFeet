import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static connectToDatabase(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // association 1:1 , it's creates a foreignKey within deliveryman model
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliveryman;
