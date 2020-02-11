import express from 'express';
import routes from './routes';

import './database/index';
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // it receives json as request
  }
  routes() {
    this.server.use(routes); // it calls all routes in routes.js
  }
}

export default new App();
