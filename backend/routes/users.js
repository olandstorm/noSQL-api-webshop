const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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
    .findOne({ _id: new ObjectId(userId) })
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
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
  req.app.locals.db.collection('users').insertOne(newUser);
  res.status(201).json({ message: 'The user has been added succesfully!' });
});

/* POST login a user */
router.post('/login', async (req, res) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;
  console.log('Attempting to find user:', emailInput, passwordInput);
  try {
    console.log(
      'Received request with email:',
      emailInput,
      'and password:',
      passwordInput
    );

    const user = await req.app.locals.db
      .collection('users')
      .findOne({ email: emailInput });

    console.log('User found', user);

    if (user) {
      if (user.password === passwordInput) {
        res.json({ user: user._id });
      } else {
        res.status(401).json({ message: 'Wrong password' });
      }
    } else {
      res
        .status(401)
        .json({ message: 'User does not exist or something else is wrong!' });
    }
  } catch {
    console.error('Error while looking up user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
