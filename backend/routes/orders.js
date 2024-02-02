const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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
router.post('/add', async (req, res) => {
  try {
    const { user, products } = req.body;

    if (!user || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: 'Something is wrong in the request format' });
    }

    const db = req.app.locals.db;

    const userExists = await db
      .collection('users')
      .findOne({ _id: new ObjectId(user) });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = {
      user: new ObjectId(user),
      products: [],
    };

    for (const { productId, quantity } of products) {
      const product = await db
        .collection('products')
        .findOne({ _id: new ObjectId(productId) });
      if (!product) {
        return res.status(400).json({ error: 'This product doesnt exist!' });
      }

      if (product.lager < quantity) {
        return res
          .status(400)
          .json({ error: 'One/or more product(s) is out of stock!' });
      }

      order.products.push({
        productId: new ObjectId(productId),
        quantity: parseInt(quantity),
      });

      const updatedStock = product.lager - quantity;
      await db
        .collection('products')
        .updateOne(
          { _id: new ObjectId(productId) },
          { $set: { lager: updatedStock } }
        );
    }

    const { insertedId } = await db.collection('orders').insertOne(order);

    res.status(201).json({ orderId: insertedId });
  } catch (error) {
    console.error('Error when creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
