const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./models/User.model');

function initialize(passport) {
  const authenticateUser = async function (login, password, done) {
    await User.findOne({ login }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }

  passport
    .use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'pass'
    }, authenticateUser));

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (_id, done) {
    User.findById(_id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize
