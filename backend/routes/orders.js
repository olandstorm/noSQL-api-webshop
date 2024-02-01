const express = require('express');
const router = express.Router();

/* GET all orders */
router.get('/all', (req, res) => {
  res.send('respond with a resource');
});

/* POST a new order for a user */
router.post('/all', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
