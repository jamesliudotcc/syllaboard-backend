import * as express from 'express';

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { Cohort } from '../entity/Cohort';
import { Deliverable } from '../entity/Deliverable';
import { User } from '../entity/User';

const cohortRepository = getMongoRepository(Cohort);
const deliverableRepository = getMongoRepository(Deliverable);
const usersRepository = getMongoRepository(User);

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

router.get('/deliverables', requireAuth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    const student = await usersRepository.findOne(req.user._id);
    const promises = student.deliverables.map(deliverable =>
      deliverableRepository.findOne(deliverable),
    );
    Promise.all(promises).then(deliverables => {
      console.log(deliverables);
      return res.send(deliverables);
    });

    console.log('At the users deliverables GET route', req.user._id);
    // res.send({
    //   message: 'At the users deliverables GET route',
    //   user: student,
    //   studentDeliverables,
    // });
  } catch (error) {
    console.log('Error with the user/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/deliverables/:id', requireAuth, async (req, res) => {
  // TODO: change to student
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    console.log('At the users deliverables/:id PUT route', req.user._id);
    res.send('At the users deliverables/:id PUT route');
  } catch (error) {
    console.log('Error with user/deliverable/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});
module.exports = router;
