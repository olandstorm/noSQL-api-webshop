const express = require('express');
const router = express.Router();

/* GET all users / do not return passwords */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

/* POST one user id / return all info of user */
router.post('/', (req, res) => {
  res.send('respond with a resource');
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
