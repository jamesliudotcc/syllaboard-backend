import * as express from 'express';

// TypeORM setup
import { getMongoManager, getMongoRepository } from 'typeorm';
import { User } from '../../entity/User';

const usersRepository = getMongoRepository(User);

const manager = getMongoManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../../services/passport');
import passport = require('passport');

import { editUser } from './adminEdits';

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });

/*************************************** */
//             Controllers
/*************************************** */

router.get('/', requireAuth, async (req, res) => {
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

router.get('/:id', requireAuth, async (req, res) => {
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

router.post('/', requireAuth, async (req, res) => {
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
    res.send({ user: mintedUser });
  } catch (error) {
    console.log('Error with /admin/users POST route:', error);
    return res.status(503).send({ user: null });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Not an admin' });
  }
  try {
    console.log('In the PUT /admin/user');

    const toEditUser = await usersRepository.findOne(req.params.id);

    const editedUser = editUser(toEditUser, req.body);

    await usersRepository.updateOne(toEditUser, {
      $set: editedUser,
    });

    res.send({
      edited: editedUser,
    });
  } catch (error) {
    console.log('Error with admin/user/ PUT route:', error);
    return res.status(503).send({ user: null });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
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

module.exports = router;
