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

// Assignments: Instructor can CRUD assignments to turn into deliverables

router.post('/assignments', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors assignments POST route', req.user._id);
    res.send('At the instructors assignments POST route');
  } catch (error) {
    console.log('Error with the instructor/assignments/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/assignments', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors assignments GET route', req.user._id);
    res.send('At the instructors assignments GET route');
  } catch (error) {
    console.log('Error with the instructor/assignments/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/assignments/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors assignments PUT route', req.user._id);
    res.send('At the instructors assignments PUT route');
  } catch (error) {
    console.log('Error with the instructor/assignments/ PUT route', error);
    return res.send({ error: 'error' });
  }
});

router.delete('/assignments/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors assignments DELETE route', req.user._id);
    res.send('At the instructors assignments DELETE route');
  } catch (error) {
    console.log('Error with the instructor/assignments/ DELETE route', error);
    return res.send({ error: 'error' });
  }
});

// Instructor can send an assignment to cohort as deliverable
router.get('/cohorts', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }

  // See note from Parker. Like note from Sarah on admin.
  try {
    //
    console.log('At the instructors cohorts POST route', req.user._id);
    res.send('At the instructors cohort POST route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.post('/cohorts/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors cohorts POST route', req.user._id);
    res.send('At the instructors cohort POST route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/cohorts/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors cohorts POST route', req.user._id);
    res.send('At the instructors cohort POST route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ POST route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/cohorts/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
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
  // TODO: change to instructor
  // if (req.user.role !== 'admin') {
  //   return res.status(403).send({ error: 'Not a student' });
  // }
  try {
    //
    console.log('At the instructors cohorts DELETE route', req.user._id);
    res.send('At the instructors cohort DELETE route');
  } catch (error) {
    console.log('Error with the instructor/cohorts/ DELETE route', error);
    return res.send({ error: 'error' });
  }
});
// Instructor can see what were turned in and grade them.

router.get('/deliverables', requireAuth, async (req, res) => {
  // TODO: change to instructor
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    console.log('At the instructors deliverables GET route', req.user._id);
    res.send('At the instructors deliverables GET route');
  } catch (error) {
    console.log('Error with the instructor/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.get('/deliverables/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    console.log('At the instructors deliverables GET route', req.user._id);
    res.send('At the instructors deliverables GET route');
  } catch (error) {
    console.log('Error with the instructor/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/deliverables/:id', requireAuth, async (req, res) => {
  // TODO: change to instructor
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    console.log('At the instructors deliverables/:id PUT route', req.user._id);
    res.send('At the instructors deliverables/:id PUT route');
  } catch (error) {
    console.log('Error with instructor/deliverable/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});
module.exports = router;
