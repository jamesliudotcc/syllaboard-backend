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

/*************************************** */
//             Controllers
/*************************************** */

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

router.post('/users', async (req, res) => {
  console.log('In the POST /users');
  console.log(req.body);

  //   if (!req.user) {
  //     return res.status(401).send({ user: null });
  //   }

  try {
    res.send(req.body);
  } catch (error) {
    console.log('Error with /admin/users POST route:', error);
    return res.status(503).send({ user: null });
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

router.post('/cohorts', async (req, res) => {
  console.log('In the POST /admin/cohort');
  console.log(req.body);

  //   if (!req.user) {
  //     return res.status(401).send({ user: null });
  //   }

  try {
    console.log(req.body);
    const newCohort = new Cohort();
    newCohort.name = req.body.name;
    newCohort.campus = req.body.campus;
    newCohort.startDate = new Date(req.body.startDate);
    newCohort.endDate = new Date(req.body.endDate);

    const createdCohort = await cohortRepository.create(newCohort);
    const savedCohort = await manager.save(createdCohort);
    res.send(savedCohort);

    // const cohort = await cohortRepository.findOne({ name: req.body.name });

    // if (cohort) {
    //   return res.status(409).send('Cohort already exists');
    // }

    // const createdCohort = await cohortRepository.create(req.body);
    // const savedCohort = await manager.save(createdCohort);

    // return res.send(req.params.id);
  } catch (error) {
    console.log('Error with admin/cohort/ POST route:', error);
    return res.status(503).send({ user: null });
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
