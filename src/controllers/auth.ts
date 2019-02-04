import * as express from 'express';
const jwt = require('jsonwebtoken');
import * as validator from 'validator';

const cors = require('cors');

// TypeORM setup

import { getRepository, getManager } from 'typeorm';
import { User } from '../entity/User';

const userRepository = getRepository(User);
const manager = getManager();

// Express setup

const router = express.Router();

// Controllers

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You logged out. Bye!');
  res.redirect('/');
});

router.post('/signup', async (req, res) => {
  //TODO debug statements; remove when no longer needed
  console.log('In the POST /auth/signup route');

  try {
    const user = await userRepository.findOne({ email: req.body.email });

    if (user) {
      // If user exists, don't let them create a duplicate
      return res.status(409).send('User already exists');
    }

    // TODO: Add some validations
    const createdUser = await userRepository.create(req.body);
    const savedUser = await manager.save(createdUser);

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

module.exports = router;
