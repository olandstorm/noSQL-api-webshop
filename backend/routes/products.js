const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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
    .findOne({ _id: new ObjectId(productId) })
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
  console.log(req.body);
  let newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    lager: req.body.lager,
  };
  console.log(newProduct);
  req.app.locals.db.collection('products').insertOne(newProduct);
  res.status(201).json({ message: 'The product has been added succesfully!' });
});

module.exports = router;
