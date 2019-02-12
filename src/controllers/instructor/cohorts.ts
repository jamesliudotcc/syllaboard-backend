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

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });

/*************************************** */
//             Controllers
/*************************************** */

router.get('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const cohorts = await cohortRepository.find({
      where: { instructors: req.user._id },
    });

    return res.send({ cohorts });
  } catch (error) {
    console.log('Error with the instructor/cohorts/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.post('/:id', requireAuth, async (req, res) => {
  //
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const { instructor, cohort, assignment } = await assignmentToDeliverable(
      req,
    );
    res.send({
      message: 'At the instructors cohort POST route',
      instructor,
      cohort,
      assignment,
      dueDate: new Date(req.body.dueDate),
    });
  } catch (error) {
    console.log('Error with the instructor/cohorts/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  //
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    const cohort = await cohortRepository.findOne(req.params.id);

    const instructorsForCohort = cohort.instructors.map(instructor =>
      usersRepository.findOne(instructor),
    );
    Promise.all(instructorsForCohort).then(instructors => {
      const cohortWithInstructors = { ...cohort, instructors };

      const studentsForCohort = cohort.students.map(student =>
        usersRepository.findOne(student),
      );
      Promise.all(studentsForCohort).then(students => {
        const cohortWithStudents = { ...cohortWithInstructors, students };

        return res.send({ cohort: cohortWithStudents });
      });
    });
  } catch (error) {
    console.log('Error with the instructor/cohorts/:id GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  // Nice to have, not implemented.

  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    //
    res.send('At the instructors cohort PUT route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ PUT route', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  // This route removes a deliverable from a cohort
  // Nice to have, not implemented.

  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    //
    res.send('At the instructors cohort DELETE route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ DELETE route', error);
    return res.send({ error: 'error' });
  }
});
module.exports = router;
