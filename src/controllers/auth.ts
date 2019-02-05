import * as express from 'express';
import jwt = require('jsonwebtoken');
// const jwt = require('jsonwebtoken');

// TypeORM setup
import { getManager, getRepository } from 'typeorm';
import { User } from '../entity/User';

const userRepository = getRepository(User);
const manager = getManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../services/passport');
import passport = require('passport');

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

// Create new JWT token without password/unneeded info
const createToken = user =>
  jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1w',
    },
  );

// Controllers

/* POST /auth/signin - Require user/password, return JWT */
router.post('/signin', requireSignIn, (req, res) => {
  const token = createToken(req.user);
  return res.send({ token });
});

// TODO: Remove this route after done testing
/* GET /auth/test - Require JWT, Return message */
router.get('/test', requireAuth, (req, res) => {
  return res.send({ message: 'Hello There!' });
});

/* GET /auth/signup - Take user data and create new user in db, return JWT */
router.post('/signup', async (req, res) => {
  // TODO: debug statements; remove when no longer needed
  console.log('In the POST /auth/signup route');
  console.log(req.body);

  try {
    const user = await userRepository.findOne({ email: req.body.email });
    console.log(user);

    if (user) {
      // If user exists, don't let them create a duplicate
      return res.status(409).send('User already exists');
    }

    // TODO: Add some validations
    const createdUser = await userRepository.create(req.body);
    const savedUser = await manager.save(createdUser);

    console.log('Saved User:', savedUser);

    const token = createToken(savedUser);
    return res.send({ token });
  } catch (err) {
    console.log('Error in POST /auth/signup', err);
    return res.status(503).send('Database Error');
  }
});

/* GET /auth/current/user - Requires JWT, returns user data */
router.post('/current/user', requireAuth, async (req, res) => {
  console.log('GET /auth/current/user STUB');

  if (!req.user) {
    return res.status(401).send({ user: null });
  }

  try {
    const user = await userRepository.findOne({ email: req.user.email });
    return res.send({ user });
  } catch (err) {
    console.log('Error with /auth/current GET route:', err);
    return res.status(503).send({ user: null });
  }
});

module.exports = router;
