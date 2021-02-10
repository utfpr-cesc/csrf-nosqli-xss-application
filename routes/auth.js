var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());

const Users = require('../models/users');

/* POST login */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  Users.findOne(req.body).then(
    (existingUser) => {
      if (existingUser) {
        console.log(`User "${existingUser.username}" logged in`);
        req.session.user = existingUser.username;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(existingUser);
      } else {
        console.error(`Wrong username ("${username}") or password ("${password}").`);
        req.session.destroy();
        res.clearCookie('session-id');
        res.statusCode = 401; // Unauthorized.
        res.setHeader('Content-Type', 'text/plain');
        res.send(`Wrong username or password.`);
      }
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

/* POST logout */
router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.clearCookie('session-id');
  res.statusCode = 204; // No content.
  res.send();
});

module.exports = router;
