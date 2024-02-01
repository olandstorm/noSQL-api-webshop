const express = require('express');
const router = express.Router();

/* GET all products */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

/* GET specific product */
router.get('/:id', (req, res) => {
  res.send('respond with a resource');
});

/* POST a new product */
router.post('/add', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
