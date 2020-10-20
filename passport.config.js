const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByLogin, getUserById) {
  const authenticateUser = async (login, password, done) => {
    const user = await getUserByLogin(login);
    if (!user) {
      return done(null, false, { message: 'No user with that login!' })
    }
    try {
      console.log('try');
      if (user.pass === password) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Passwords do not match!' })
      }
    } catch (e) {
      console.error(e);
      done(e)
    }
  };

  passport
    .use(new LocalStrategy({
      loginField: 'login',
      passField: 'password'
    }, authenticateUser));
}

module.exports = initialize
