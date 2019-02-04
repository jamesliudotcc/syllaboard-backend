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

    // Helper function: This allows our server to parse the incoming token from the client
    // This is being run as middleware, so it has access to the incoming request
    function fromRequest(req) {
      if (
        req.body.headers.Authorization &&
        req.body.headers.Authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.body.headers.Authorization.split(' ')[1];
      }
      return null;
    }

    /* ****************************************
    //              Routes
    ******************************************/

    app.use(
      '/auth',
      expressJwt({
        secret: process.env.JWT_SECRET,
        getToken: fromRequest,
      }).unless({
        path: [
          { url: '/auth/login', methods: ['POST'] },
          { url: '/auth/signup', methods: ['POST'] },
        ],
      }),
      require('./controllers/auth'),
    );

    app.use(express.static('static'));

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
