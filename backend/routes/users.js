const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');

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
  console.log(req.body);
  let newUser = {
    id: randomUUID(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
  req.app.locals.db.collection('users').insertOne(newUser);
  res.status(201).json({ message: 'The user has been added succesfully!' });
});

/* POST login a user */
router.post('/login', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
