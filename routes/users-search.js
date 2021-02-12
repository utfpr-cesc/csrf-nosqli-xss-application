const express = require('express');
const router = express.Router();

const Users = require('../models/users');

/* GET users search page. */
router.get('/search', function(req, res, next) {
  const { query } = req.query;

  if (typeof query !== 'string') {
    const errorMessage = `Query "${query}" is not a string.`;
    console.error(errorMessage);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.send(errorMessage);
  }

  Users.find({
    username: {
      $regex: query
    }
  }).then(
    (users) => {
      res.render('users-search', {
        query,
        users: users.map(
          (user) => ({
            id: user._id,
            name: user.username
          })
        )
      });
    },
    (err) => next(err)
  ).catch((err) => next(err));
});

module.exports = router;
