import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
  static connectToDatabase(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // association 1:1 , it's creates a foreignKey within orders model
  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'delivery_id',
      as: 'delivery',
    });
  }
}

export default Problem;
