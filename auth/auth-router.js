const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // make a token
        // 1- decide a payload
        const payload = {
          sub: user.id,
          username: user.username,
          roles: ['student'],
        }
        // 2- decide config (like exp data)
        const options = {
          expiresIn: 60,
        }
        // 3- build & sign the token
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || 'secret',
          options,
        )

        res.json({
          message: 'Here is your token, do not lose it!!!!',
          token,
        })
        // 4- send token back
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
