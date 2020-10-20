const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

// Models
const { User } = require('./models/User.model');

// Middlewares
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

function checkNotAuth(req, res, next) {
  if(req.isAuthenticated()) {
    console.log(req.isAuthenticated())
    return res.redirect('/');
  }
  next();
}

// Passport initializing
const initializePassport = require('./passport.config');
initializePassport(
  passport,
  async login => await User.findOne({ login }),
  async _id => await User.findOne({ _id })
);

const Router = express.Router();
const PORT = 4321;
const headers = { 'Content-Type': 'text/html; charset=utf-8' };
const app = express();

Router
  .route('/')
  .get((req, res) => {
    res.end('Привет мир!');
  })

app
  .use((req, res, next) => {
    res
      .status(200)
      .set(headers) && next();
  })
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/', Router)
  .get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
  })
  .post('/login/check', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))
  .get('/profile', checkAuth, r => {
    r.res.send(r.session.login);
  })
  .get('/users', checkAuth, async r => {
    const users = await User.find();
    r.res.render('users', { users });
  })
  .use('/login', (req, res) => {
    res.render('login');
  })
  .use((req, res) => {
    res
      .status(404)
      .set(headers)
      .send('Пока нет!');
  })
  .use((e, req, res, n) => {
    res
      .status(500)
      .set(headers)
      .send(`Ошибка: ${e}`);
  })
  .set('view engine', 'pug')
  .set('x-powered-by', false);

module.exports = http
  .createServer(app)
  .listen(process.env.PORT || PORT, () => console.log(process.pid));
