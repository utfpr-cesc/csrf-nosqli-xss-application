var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const url = `mongodb://localhost:27017/`;
const dbname = `csrf_nosqli_xss_application`;
const connect = mongoose.connect(`${url}${dbname}`);

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersSearchRouter = require('./routes/users-search');
var usersRouter = require('./routes/users');

// Connects to the database:
connect.then(
  (db) => {
    console.log('Connected to MongoDB');
  },
  (err) => {
    console.error('Error while connecting to MongoDB:', err);
  }
);

var app = express();

// Disables the 'X-Powered-By: Express' HTTP Header:
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore(),
}));
app.use(function(req,res,next){
  res.locals.session = req.session; // Exposes session data to `locals` scope.
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Public (unauthenticated) routes:
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersSearchRouter);

app.use(
  /**
   * Custom session validation middleware.
   *
   * @param {express.Request} req Request object.
   * @param {express.Response} res Response object.
   * @param {express.NextFunction} next Next function.
   */
  function (req, res, next) {

    const userCookie = req.session.user;
    if (userCookie) {
      next();
      return;
    } else {
      console.error(`[AUTH] No user cookie (userCookie === ${userCookie}) on request to "${req.url}"`);
      res.redirect('/login');
    }

  }
)

// Private (authenticated) routes:
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
