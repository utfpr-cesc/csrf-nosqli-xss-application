const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());

const Users = require('../models/users');

/* GET all users */
router.get('/', function(req, res, next) {
  Users.find({}).then(
    (users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

/* POST user */
router.post('/', function(req, res, next) {
  const { username, password } = req.body;
  Users.findOne({
    username,
  }).then(
    (existingUser) => {
      if (existingUser) {
        const errorMessage = `User "${existingUser.username}" already exists.`;
        console.error(errorMessage);
        res.statusCode = 422; // Unprocessable entity.
        res.setHeader('Content-Type', 'text/plain');
        res.send(errorMessage);
      } else {
        return Users.create({
          username,
          password,
        }).then(
          (user) => {
            console.log(`User "${user.username}" created with password "${user.password}".`);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
          },
          (err) => next(err)
        );
      }
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

/* GET user */
router.get('/:userId', function(req, res, next) {
  Users.findById(req.params.userId).then(
    (user) => {
      if (!user) {
        res.statusCode = 404;
        res.send();
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

/* PUT user */
router.put('/:userId', function(req, res, next) {
  Users.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    {
      new: true,
    }
  ).then(
    (user) => {
      if (!user) {
        res.statusCode = 404;
        res.send();
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

/* DELETE user */
router.delete('/:userId', function(req, res, next) {
  Users.findByIdAndDelete(req.params.userId).then(
    (user) => {
      if (!user) {
        res.statusCode = 404;
        res.send();
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

module.exports = router;
