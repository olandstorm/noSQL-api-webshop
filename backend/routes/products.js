const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
require('dotenv').config();

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
router.post('/add', async (req, res) => {
  try {
    const tokenFromClient = req.body.token;
    const correctToken = process.env.ADMIN_TOKEN;

    if (tokenFromClient !== correctToken) {
      console.error('Wrong token input!');
      return res.status(401).json({
        message: 'You need to have the correct token to create a new product!',
      });
    }
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      lager: req.body.lager,
      category: req.body.category,
    };

    console.log(newProduct);
    await req.app.locals.db.collection('products').insertOne(newProduct);
    res
      .status(201)
      .json({ message: 'The product has been added succesfully!' });
  } catch (error) {
    console.error('Error while trying to add product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* GET all products with a specific category */
router.get('/category/:id', (req, res) => {});

module.exports = router;
