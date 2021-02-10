const express = require('express');
const router = express.Router();

const Users = require('../models/users');

/* GET users search page. */
router.get('/search', function(req, res, next) {
  const { query } = req.query;
  Users.find({
    username: {
      $regex: query
    }
  }).then(
    (users) => {
      res.render('users-search', {
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
