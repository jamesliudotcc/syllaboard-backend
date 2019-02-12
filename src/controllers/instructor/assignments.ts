import * as express from 'express';

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { Assignment } from '../../entity/Assignment';
import { Deliverable } from '../../entity/Deliverable';
import { User } from '../../entity/User';

export const assignmentRepository = getMongoRepository(Assignment);
export const deliverableRepository = getMongoRepository(Deliverable);
export const usersRepository = getMongoRepository(User);

export const manager = getMongoManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../../services/passport');
import passport = require('passport');

import { editAssignment } from './edits';
import { validateNewInstructor } from './validateNewInstructor';

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });

/*************************************** */
//             Controllers
/*************************************** */

router.post('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    const incoming = req.body;
    incoming.instructor = req.user._id;

    const mintedAssignment = await validateNewInstructor(incoming);

    console.log('At the instructors assignments POST route', req.user._id);
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

router.get('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    //
    console.log('At the instructors assignments GET route', req.user._id);

    const assignments = await assignmentRepository.find();
    res.send({ assignments });
  } catch (error) {
    console.log('Error with the instructor/assignments/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send({ error: 'Not a instructor' });
  }
  try {
    console.log('At the instructors assignments PUT route', req.user._id);

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

router.delete('/:id', requireAuth, async (req, res) => {
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
module.exports = router;
