import * as express from 'express';
import jwt = require('jsonwebtoken');
// const jwt = require('jsonwebtoken');

// TypeORM setup
import { getManager, getMongoRepository } from 'typeorm';
import { Cohort } from '../entity/Cohort';
import { User } from '../entity/User';

const userRepository = getMongoRepository(User);
const cohortRepository = getMongoRepository(Cohort);
const manager = getManager();

// Express setup
const router = express.Router();

// Load passport config
// tslint:disable-next-line:no-var-requires
const passportService = require('../services/passport');
import passport = require('passport');

// Auth strategies
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

// Create new JWT token without password/unneeded info
const createToken = user =>
  jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1w',
    },
  );

// Controllers

/* POST /auth/signin - Require user/password, return JWT */
router.post('/signin', requireSignIn, (req, res) => {
  const token = createToken(req.user);
  const role = req.user.role;
  return res.send({ token, role });
});

// TODO: Remove this route after done testing
/* GET /auth/test - Require JWT, Return message */
router.get('/test', requireAuth, (req, res) => {
  console.log('In /auth/test');
  return res.send({ message: 'Hello There!', role: req.user.role });
});

/* GET /auth/signup - Take user data and create new user in db, return JWT */
router.post('/signup', async (req, res) => {
  // TODO: debug statements; remove when no longer needed
  console.log('In the POST /auth/signup route');

  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // If user exists, don't let them create a duplicate
    const user = await userRepository.findOne({ email: newUserData.email });
    if (user) {
      console.log('Existing User:', user.firstName);
      return res.status(409).send('User already exists');
    }

    // Check if is key is for instructor
    const instructorCohort = await cohortRepository.findOne({
      instructorKey: req.body.cohortKey,
    });
    if (instructorCohort) {
      const createdInstructor = await userRepository.create(newUserData);
      createdInstructor.role = 'instructor';
      const savedInstructor = await manager.save(createdInstructor);

      console.log('Saved Instructor:', savedInstructor);

      // Add instructor id to cohort
      const newInstructor = await userRepository.findOne({
        email: savedInstructor.email,
      });
      instructorCohort.instructors.push(newInstructor._id);
      await cohortRepository.save(instructorCohort);

      const instructorToken = createToken(savedInstructor);
      const instructorRole = savedInstructor.role;
      return res.send({ token: instructorToken, role: instructorRole });
    }

    // Check if is key is for student
    const studentCohort = await cohortRepository.findOne({
      studentKey: req.body.cohortKey,
    });
    if (studentCohort) {
      const createdStudent = await userRepository.create(newUserData);
      createdStudent.role = 'student';
      const savedStudent = await manager.save(createdStudent);

      console.log('Saved Student:', savedStudent);

      // Add instructor id to cohort
      const newStudent = await userRepository.findOne({
        email: savedStudent.email,
      });
      studentCohort.students.push(newStudent._id);
      await cohortRepository.save(studentCohort);

      const studentToken = createToken(savedStudent);
      const studentRole = savedStudent.role;
      return res.send({ token: studentToken, role: studentRole });
    }

    return res.status(409).send('No cohort found');
  } catch (err) {
    console.log('Error in POST /auth/signup', err);
    return res.status(503).send('Database Error');
  }
});

/* GET /auth/current/user - Requires JWT, returns user data */
router.post('/current/user', requireAuth, async (req, res) => {
  console.log('GET /auth/current/user STUB');

  if (!req.user) {
    return res.status(401).send({ user: null });
  }

  try {
    const user = await userRepository.findOne({ email: req.user.email });
    return res.send({ user });
  } catch (err) {
    console.log('Error with /auth/current GET route:', err);
    return res.status(503).send({ user: null });
  }
});

module.exports = router;
