import * as express from 'express';

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

router.get('/users', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    console.log('User attempting to see list of users is a:', req.user.role);
    const users = await usersRepository.find({});
    return res.send({ users });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.get('/users/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    const user = await usersRepository.findOneOrFail(req.params.id);
    return res.send({ user });
  } catch (error) {
    console.log('Something went wrong', error);
    return res.send({ error: 'error' });
  }
});

router.post('/users', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  console.log('In the POST /users');
  console.log(req.body);

  try {
    console.log(req.body);
    const newUser = new User();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.role = 'student';

    const createdUser = await usersRepository.create(newUser);
    const savedUser = await manager.save(createdUser);
    const mintedUser = await usersRepository.findOne(savedUser);
    res.send(mintedUser);
  } catch (error) {
    console.log('Error with /admin/users POST route:', error);
    return res.status(503).send({ user: null });
  }
});

router.put('/users/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    console.log('In the PUT /admin/user');

    const toEditUser = await usersRepository.findOne(req.params.id);

    const editedUser = validateUser(toEditUser, req.body);

    const updatedUser = await usersRepository.updateOne(toEditUser, {
      $set: editedUser,
    });

    res.send({
      edited: updatedUser,
    });
  } catch (error) {
    console.log('Error with admin/user/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});

router.delete('/users/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
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

router.get('/cohorts', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    const cohorts = await cohortRepository.find({});
    return res.send({ cohorts });
  } catch (error) {
    console.log('Error with the admin/cohorts/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.post('/cohorts', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  console.log('In the POST /admin/cohort');
  console.log(req.body);

  try {
    console.log(req.body);
    const newCohort = new Cohort();
    newCohort.name = req.body.name;
    newCohort.campus = req.body.campus;
    newCohort.startDate = new Date(req.body.startDate);
    newCohort.endDate = new Date(req.body.endDate);

    const createdCohort = await cohortRepository.create(newCohort);
    const savedCohort = await manager.save(createdCohort);
    const mintedCohort = await cohortRepository.findOne(savedCohort);
    res.send(mintedCohort);
  } catch (error) {
    console.log('Error with admin/cohort/ POST route:', error);
    return res.status(503).send({ user: null });
  }
});

router.put('/cohorts/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    console.log('In the PUT /admin/cohort');
    // TODO: refactor, change name of toEditCohort to cohort
    const toEditCohort = await cohortRepository.findOne(req.params.id);

    // TODO: refactor: change name of validateCohort to editCohort
    const editedCohort = validateCohort(toEditCohort, req.body);

    const updatedCohort = await cohortRepository.updateOne(toEditCohort, {
      $set: editedCohort,
    });

    res.send({
      edited: updatedCohort,
    });
  } catch (error) {
    console.log('Error with admin/cohort/ POST route:', error);
    return res.status(503).send({ user: null });
  }
});

router.delete('/cohorts/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
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

router.put('/cohorts/instructors/:id', requireAuth, async (req, res) => {
  // Body should be an array of userIds as JSON (application/json)
  // :id refers to the ID of the cohort to be edited.

  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }

  try {
    console.log('In add instrutor to cohort route');

    const toEditCohort = await cohortRepository.findOne(req.params.id);

    // TODO: Learn promsie all and refactor. Not today.
    req.body.forEach(async userId => {
      const eachUser = await usersRepository.findOne(userId);
      if (eachUser.role === 'instructor') {
        console.log(eachUser);
        console.log(toEditCohort);
        await cohortRepository.updateOne(toEditCohort, {
          $addToSet: { instructors: eachUser._id },
        });
      }
    });

    // Figure out a better message
    res.status(202).send('ok');
  } catch (error) {
    console.log('Error with admin/cohort/ POST route:', error);
    return res.status(503).send({ user: null });
  }
});

module.exports = router;

/*************************************** */
//          Edit Functions
/*************************************** */

function validateCohort(
  toEditCohort: Cohort,
  incoming: any,
): { name?: string; campus?: string; startDate?: Date; endDate?: Date } {
  const editedCohort = { ...toEditCohort };

  if (incoming.name) {
    editedCohort.name = incoming.name;
  }

  if (incoming.campus) {
    editedCohort.campus = incoming.campus;
  }

  editedCohort.startDate = incoming.startDate
    ? new Date(incoming.startDate)
    : new Date(toEditCohort.startDate);

  editedCohort.endDate = incoming.endDate
    ? new Date(incoming.endDate)
    : new Date(toEditCohort.endDate);

  return editedCohort;
}

function validateUser(
  toEditUser: User,
  incoming: any,
): {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'admin' | 'instructor' | 'student';
} {
  const editedUser = { ...toEditUser };

  if (incoming.firstName) {
    editedUser.firstName = incoming.firstName;
  }
  if (incoming.lastName) {
    editedUser.lastName = incoming.lastName;
  }
  if (incoming.email) {
    editedUser.email = incoming.email;
  }
  if (incoming.role) {
    editedUser.role = incoming.role;
  }
  return editedUser;
}
