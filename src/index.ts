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

createConnection({
  type: 'mongodb',
  host: process.env.MONGODB_URL,
  port: Number(process.env.MONGODB_PORT),
  database: 'test3',
  entities: [Assignment, Cohort, Deliverable, Topic, User],
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
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

    app.use('/admin/cohorts', require('./controllers/admin/cohorts'));
    app.use('/admin/users', require('./controllers/admin/users'));
    app.use(
      '/instructor/assignments',
      require('./controllers/instructor/assignments'),
    );
    app.use('/instructor/cohorts', require('./controllers/instructor/cohorts'));
    app.use(
      '/instructor/deliverables',
      require('./controllers/instructor/deliverables'),
    );
    app.use('/student', require('./controllers/student'));

    // Catchall Route

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
