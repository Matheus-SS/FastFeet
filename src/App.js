import express from 'express';
import path from 'path';
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
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    ); //load images from browser . Look to model File also.
  }
  routes() {
    this.server.use(routes); // it calls all routes in routes.js
  }
}

export default new App();
