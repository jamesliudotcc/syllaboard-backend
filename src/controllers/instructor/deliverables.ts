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

router.get('/', requireAuth, (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  return res.send({ user: req.user });
});

router.post('/assignments', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const incoming = req.body;
    incoming.instructor = req.user._id;

    const mintedAssignment = await validateNewInstructor(incoming);

    res.send({
      message: 'At the instructors assignments POST route',
      assignment: mintedAssignment,
      incoming,
    });
  } catch (error) {
    console.log('Error with the instructor/assignments/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/assignments', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const assignments = await assignmentRepository.find();
    res.send({ assignments });
  } catch (error) {
    console.log('Error with the instructor/assignments/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/assignments/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const toEditAssignment = await assignmentRepository.findOne(req.params.id);

    const editedAssignment = editAssignment(toEditAssignment, req.body);

    const updatedAssignment = await assignmentRepository.updateOne(
      toEditAssignment,
      {
        $set: editedAssignment,
      },
    );

    return res.send({
      edited: updatedAssignment,
    });
  } catch (error) {
    console.log('Error with the instructor/assignments/ PUT route', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/assignments/:id', requireAuth, async (req, res) => {
  // Nice to have, not implemented.

  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    console.log(`DELETE assignment ${req.params.id}`);
    // TODO: Should any teacher be able to delete an assignment?

    const assignment = await assignmentRepository.findOne(req.params.id);
    const deletedAssignment = await assignmentRepository.findOneAndDelete(
      assignment,
    );

    return res.send({ deleted: deletedAssignment });
  } catch (error) {
    console.log('Error with the instructor/assignments/ DELETE route', error);
    return res.send({ error: 'error' });
  }
});

// Instructor can send an assignment to cohort as deliverable
router.get('/cohorts', requireAuth, async (req, res) => {
  // return res.status(403).send(req.user);
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

router.post('/cohorts/:id', requireAuth, async (req, res) => {
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

router.get('/cohorts/:id', requireAuth, async (req, res) => {
  //
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    console.log('At the instructors cohorts/:id GET route', req.user._id);
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

router.put('/cohorts/:id', requireAuth, async (req, res) => {
  // Nice to have, not implemented.

  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    //
    console.log('At the instructors cohorts PUT route', req.user._id);
    res.send('At the instructors cohort PUT route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ PUT route', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/cohorts/:id', requireAuth, async (req, res) => {
  // This route removes a deliverable from a cohort
  // Nice to have, not implemented.

  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not an instructor' });
  }
  try {
    res.send('At the instructors cohort DELETE route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ DELETE route', error);
    return res.send({ error: 'error' });
  }
});
// Instructor can see what were turned in and grade them.

router.get('/deliverables', requireAuth, async (req, res) => {
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

router.get('/deliverables/:id', requireAuth, async (req, res) => {
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

router.put('/deliverables/:id', requireAuth, async (req, res) => {
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
