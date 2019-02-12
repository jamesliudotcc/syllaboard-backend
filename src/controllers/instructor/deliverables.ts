import * as express from 'express';

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { Assignment } from '../../entity/Assignment';
import { Cohort } from '../../entity/Cohort';
import { Deliverable } from '../../entity/Deliverable';
import { User } from '../../entity/User';

export const assignmentRepository = getMongoRepository(Assignment);
export const cohortRepository = getMongoRepository(Cohort);
export const deliverableRepository = getMongoRepository(Deliverable);
export const usersRepository = getMongoRepository(User);

export const manager = getMongoManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../../services/passport');
import passport = require('passport');

import { assignmentToDeliverable } from './assignmentToDeliverable';
import { editAssignment, editDeliverable } from './edits';
import { validateNewInstructor } from './validateNewInstructor';

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });

// Assignments: Instructor can CRUD assignments to turn into deliverables

router.get('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    const deliverables = await deliverableRepository.find({
      where: { instructor: req.user._id },
    });

    res.send({
      message: 'At the instructors deliverables GET route',
      deliverables,
    });
  } catch (error) {
    console.log('Error with the instructor/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    const deliverable = await deliverableRepository.findOne(req.params.id);
    const student = await usersRepository.findOne(deliverable.student[0]);
    res.send({
      message: 'At the instructors deliverables GET route',
      deliverable,
      student,
    });
  } catch (error) {
    console.log('Error with the instructor/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    const deliverable = await deliverableRepository.findOne(req.params.id);

    const editedDeliverable = editDeliverable(deliverable, req.body);

    // Persist to database
    const updatedDeliverable = await deliverableRepository.updateOne(
      deliverable,
      { $set: editedDeliverable },
    );

    res.send({
      message: 'At the users deliverables/:id PUT route',
      editedDeliverable,
      updatedDeliverable,
    });
    res.send('At the instructors deliverables/:id PUT route');
  } catch (error) {
    console.log('Error with instructor/deliverable/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});
module.exports = router;
