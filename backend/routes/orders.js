const express = require('express');
const router = express.Router();

/* GET all orders */
router.get('/all', (req, res) => {
  req.app.locals.db
    .collection('orders')
    .find()
    .toArray()
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'There are no orders in the database!' });
      }
    });
});

/* POST a new order for a user */
router.post('/add', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
