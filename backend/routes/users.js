const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const CryptoJS = require('crypto-js');
require('dotenv').config();

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
        try {
          const originalPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SALT_KEY
          ).toString(CryptoJS.enc.Utf8);
          user.password = originalPassword;
          res.json(user);
        } catch (error) {
          console.error('Error while decrypting the password:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(404).json({ error: 'User does not excist!' });
      }
    });
});

/* POST create a new user */
router.post('/add', (req, res) => {
  console.log(req.body);
  const userPassword = req.body.password;
  const cryptedPassword = CryptoJS.AES.encrypt(
    userPassword,
    process.env.SALT_KEY
  ).toString();
  const ogPassword = CryptoJS.AES.decrypt(
    cryptedPassword,
    process.env.SALT_KEY
  ).toString(CryptoJS.enc.Utf8);
  console.log(ogPassword);

  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: cryptedPassword,
  };

  console.log(newUser);
  req.app.locals.db.collection('users').insertOne(newUser);
  res.status(201).json({ message: 'The user has been added succesfully!' });
});

/* POST login a user */
router.post('/login', async (req, res) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;
  try {
    const user = await req.app.locals.db
      .collection('users')
      .findOne({ email: emailInput });

    if (user) {
      const originalPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SALT_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (originalPassword === passwordInput) {
        res.json({ user: user._id });
      } else {
        res.status(401).json({ message: 'Invalid username or password!' });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password!' });
    }
  } catch {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
