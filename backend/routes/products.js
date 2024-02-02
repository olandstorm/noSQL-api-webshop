const express = require('express');
const router = express.Router();

/* GET all products */
router.get('/', (req, res) => {
  req.app.locals.db
    .collection('products')
    .find()
    .toArray()
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(404)
          .json({ error: 'There are no products in the database!' });
      }
    });
});

/* GET specific product */
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  req.app.locals.db
    .collection('products')
    .findOne({ id: productId })
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product does not excist!' });
      }
    });
});

/* POST a new product */
router.post('/add', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
