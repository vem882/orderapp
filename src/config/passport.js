const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
};

const localOptions = {
  usernameField: 'username',
  passwordField: 'password'
};

// JWT-strategia
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

// Paikallinen strategia
const localLogin = new LocalStrategy(localOptions, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
  
  module.exports = (passport) => {
    passport.use(jwtLogin);
    passport.use(localLogin);
  };
