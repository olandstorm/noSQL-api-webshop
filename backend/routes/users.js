const express = require('express');
const router = express.Router();

/* GET all users / do not return passwords */
router.get('/', (req, res) => {
  req.app.locals.db
    .collection('users')
    .find({}, { projection: { password: 0 } })
    .toArray()
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'There are no users in the database!' });
      }
    });
});

/* POST one user id / return all info of user */
router.post('/', (req, res) => {
  const userId = req.body.id;
  console.log(userId);
  req.app.locals.db
    .collection('users')
    .findOne({ id: userId })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User does not excist!' });
      }
    });
});

/* POST create a new user */
router.post('/add', (req, res) => {
  res.send('respond with a resource');
});

/* POST login a user */
router.post('/login', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
