import * as express from 'express';
const jwt = require('jsonwebtoken');

// TypeORM setup

import { getRepository, getManager } from 'typeorm';
import { User } from '../entity/User';

const userRepository = getRepository(User);
const manager = getManager();

// Express setup

const router = express.Router();

// Controllers

router.post('/login', async (req, res) => {
  console.log('In the POST /auth/login route');
  console.log(req.body.password);

  // Find out if user is in DB
  try {
    const user = await userRepository.findOne({ email: req.body.email });
    console.log(user);
    if (!user || !user.password) {
      return res.status(400).send('Fill in user and password');
    }
    const validated = await user.validPassword(req.body.password);
    // User exists, check the password:
    if (!validated) {
      return res.status(401).send('Invalid credentials');
    }

    // Valid user, passed authentication. Need to make them a token

    const token = jwt.sign({ ...user, password: '' }, process.env.JWT_SECRET, {
      expiresIn: '1w', //24 hours in seconds
    });

    res.send({ token: token });
  } catch (err) {
    console.log('Error in POST /auth/login', err);
    res.status(503).send('Database Error');
  }
});

router.post('/signup', async (req, res) => {
  //TODO debug statements; remove when no longer needed
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

    const token = jwt.sign(
      { ...savedUser, password: '' }, // Don't send hashed pw over internet
      process.env.JWT_SECRET,
      { expiresIn: '1w' },
    );
    res.send({ token: token });
  } catch (err) {
    console.log('Error in POST /auth/signup', err);
    res.status(503).send('Database Error');
  }
});

router.post('/current/user', async (req, res) => {
  console.log('GET /auth/current/user STUB');

  if (!req.user) {
    return res.status(401).send({ user: null });
  }

  try {
    const user = await userRepository.findOne({ email: req.user.email });
    res.send({ user: user });
  } catch (err) {
    console.log('Error with /auth/current GET route:', err);
    res.status(503).send({ user: null });
  }
});

module.exports = router;
