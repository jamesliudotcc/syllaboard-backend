// TypeORM setup
import { getMongoRepository } from 'typeorm';
import { User } from '../entity/User';
const userRepository = getMongoRepository(User);

// Passport
import passport = require('passport');
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    // Verify email and password,
    // call done with the user if it is correct
    // otherwise call done with false
    try {
      const user = await userRepository.findOne({ email });

      if (!user || !user.password) {
        return done(null, false);
      }

      const validated = await user.validPassword(password);
      // User exists, check the password:
      if (!validated) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

// Setup options for JWT strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

// Create jwt strategy

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that
  // otherwise, call done without a user object
  try {
    const user = await userRepository.findOne(payload.id);
    console.log(user);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});


// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
