import Sequelize, { Model } from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];
class Database {
  constructor() {
    this.init();
    //this.testConnection();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
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
