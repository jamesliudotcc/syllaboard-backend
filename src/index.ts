// Express required Imports
import cors = require('cors');
import { config } from 'dotenv';
import * as express from 'express';
import logger = require('morgan');

config();

// DB required imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Assignment } from './entity/Assignment';
import { Cohort } from './entity/Cohort';
import { Deliverable } from './entity/Deliverable';
import { Topic } from './entity/Topic';
import { User } from './entity/User';

// End of upload required packages

createConnection({
  type: 'mongodb',
  host: process.env.MONGO_URL,
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [Assignment, Cohort, Deliverable, Topic, User],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    const userRepository = connection.getRepository(User);

    /* ****************************************
    //*              Initialize App
    ******************************************/

    const app = express();

    /* ****************************************
    //*             Middlewares
    ******************************************/

    app.use(logger('dev'));
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false }));


    /* ****************************************
    //*             Routes
    ******************************************/

    app.use('/auth', require('./controllers/auth'));
    app.use('/cohort', require('./controllers/cohort'));

    app.get('*', (req, res, next) => {
      res.status(404).send({ message: 'Not Found' });
    });

    /* ****************************************
    //*              Listen
    ******************************************/
    const listenPort = process.env.PORT || 3000;
    app.listen(listenPort, () => {
      console.log(`Listening at port ${listenPort}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
