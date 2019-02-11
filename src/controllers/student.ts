import * as express from 'express';

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { Deliverable } from '../entity/Deliverable';
import { User } from '../entity/User';

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

router.get('/', requireAuth, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Not a student' });
  }
  return res.send({ user: req.user });
});

router.get('/deliverables', requireAuth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    const student = await usersRepository.findOne(req.user._id);

    const delivForEachStudent = student.deliverables.map(deliverable =>
      deliverableRepository.findOne(deliverable),
    );
    Promise.all(delivForEachStudent).then(deliverables => {
      console.log(deliverables);
      return res.send({
        message: 'At the users deliverables GET route',
        student,
        deliverables,
      });
    });

    console.log('At the users deliverables GET route', req.user._id);
  } catch (error) {
    console.log('Error with the user/deliverables/ GET route', error);
    return res.send({ error: 'error' });
  }
});

router.put('/deliverables/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Not a student' });
  }
  try {
    //
    const deliverable = await deliverableRepository.findOne(req.params.id);

    const editedDeliverable = {
      ...deliverable,
      deliverable: req.body.deliverable,
      turnedIn: new Date(),
    };
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
  } catch (error) {
    console.log('Error with user/deliverable/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});
module.exports = router;
