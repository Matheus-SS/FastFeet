import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import Problem from '../app/models/Problem';

import databaseConfig from '../config/database';

const models = [User, Recipient, File, Deliveryman, Order, Problem];
class Database {
  constructor() {
    this.init();
    //this.testConnection();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.connectToDatabase(this.connection))
      //it's veryfies if exists a "associate" method, if exists it's runs the method
      .map(model => model.associate && model.associate(this.connection.models));
  }
  // test the connection with the database
  testConnection() {
    this.connection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }
}
export default new Database();
