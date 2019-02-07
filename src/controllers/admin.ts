import * as express from 'express';
import jwt = require('jsonwebtoken');

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { Cohort } from '../entity/Cohort';
import { User } from '../entity/User';

const usersRepository = getMongoRepository(User);
const cohortRepository = getMongoRepository(Cohort);

const manager = getMongoManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../services/passport');
import passport = require('passport');

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });

// Controllers

router.get('/users', async (req, res) => {
  try {
    const users = await usersRepository.find({});
    return res.send({ users });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await usersRepository.findOneOrFail(req.params.id);
    return res.send({ user });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    console.log(`DELETE user ${req.params.id}`);

    const user = await usersRepository.findOne(req.params.id);
    const deletedUser = await usersRepository.findOneAndDelete(user);

    return res.send({ deleted: deletedUser });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.get('/cohorts', async (req, res) => {
  try {
    const cohorts = await cohortRepository.find({});
    return res.send({ cohorts });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/cohorts/:id', async (req, res) => {
  try {
    console.log(`DELETE cohort ${req.params.id}`);

    const cohort = await cohortRepository.findOne(req.params.id);
    const deletedCohort = await cohortRepository.findOneAndDelete(cohort);

    return res.send({ deleted: deletedCohort });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

module.exports = router;
