// Express required Imports
const cors = require('cors');
import * as express from 'express';
require('dotenv').config();

// DB requried imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
// Import my middlewares

const isUserAuthenticated = require('./middleware/isUserAuthenticated');

// End of upload required packages

createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [User],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
})
  .then(async connection => {
    const userRepository = connection.getRepository(User);

    /* ****************************************
    //              Initialize App
    ******************************************/

    const app = express();

    /* ****************************************
    //              Middlewares
    ******************************************/

    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false }));

    // Expose Auth routes before all other
    // Middlewares run

    app.use('/auth', require('./controllers/auth'));

    // app.use(async (req, res, next) => {
    //   try {
    //     const user = await userRepository.findOne(req.session.passport.user);
    //     if (!user.approved && req.path !== '/') {
    //       req.flash('error', 'Pending approval. Nothing to see here yet.');
    //       res.redirect('/auth/pending');
    //     } else {
    //       next();
    //     }
    //   } catch (err) {
    //     console.log('Something went wrong with user approval middleware.');
    //   }
    // });

    /* ****************************************
    //              Routes
    ******************************************/

    // app.use(express.static('static'));

    app.get('*', function(req, res, next) {
      res.status(404).send({ message: 'Not Found' });
    });

    /* ****************************************
    //              Listen
    ******************************************/
    const listenPort = process.env.PORT || 3000;
    app.listen(listenPort, () => {
      console.log(`Listening at port ${listenPort}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
