import * as express from 'express';
import jwt = require('jsonwebtoken');

// TypeORM setup
import { getConnection, getMongoManager, getMongoRepository } from 'typeorm';
import { Cohort } from '../entity/Cohort';

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

// TODO: Remove this route after done testing
router.get('/test', requireAuth, (req, res) => {
  return res.send({ message: 'Hello There!' });
});

router.delete('/delete', requireAuth, async (req, res) => {
  console.log('Deleting Cohort!');
  console.log(req.body.id);

  try {
    const cohortToDelete = await manager.findOne(Cohort, req.body.id);
    const deletedCohort = await manager.findOneAndDelete(
      Cohort,
      cohortToDelete,
    );
    console.log(deletedCohort);

    return res.send({ message: 'It worked! ' });
  } catch (err) {
    console.log('Error with /cohort/delete POST route:', err);
    return res.status(503).send({ id: req.body.id });
  }
});

// Post a new Cohort
router.post('/new', requireAuth, async (req, res) => {
  console.log('In the POST cohort/new');
  console.log(req.body);

  if (!req.user) {
    return res.status(401).send({ user: null });
  }

  try {
    const cohort = await cohortRepository.findOne({ name: req.body.name });

    if (cohort) {
      return res.status(409).send('Cohort already exists');
    }

    // Turn that String into an ARRAY of strings
    req.body.students = req.body.students.split(', ');
    req.body.instructors = req.body.instructors.split(', ');

    const createdCohort = await cohortRepository.create(req.body);
    const savedCohort = await manager.save(createdCohort);

    return res.send({ savedCohort });
  } catch (err) {
    console.log('Error with /cohort/new POST route:', err);
    return res.status(503).send({ user: null });
  }
});

module.exports = router;
