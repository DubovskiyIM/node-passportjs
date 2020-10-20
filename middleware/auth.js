const ensureAuth = (req, res, done) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  return done();
};

module.exports = {
  ensureAuth
}
