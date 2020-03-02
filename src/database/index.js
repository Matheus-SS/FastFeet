import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, Recipient, File];
class Database {
  constructor() {
    this.init();
    //this.testConnection();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.connectToDatabase(this.connection));
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
