const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('../model/User'); // Import your User model

// Local Strategy (for login)
passport.use(new LocalStrategy({
  usernameField: 'userEmail',
  passwordField: 'password',
}, async (userEmail, password, done) => {
  try {
    const user = await User.findOne({ userEmail });

    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// JWT Strategy (for protecting routes)
passport.use(new JwtStrategy({
  //console.log(req)
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  
  secretOrKey: 'secret123', // Replace with your secret key
}, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    //console.log(user);
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
