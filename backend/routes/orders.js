const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

/* GET all orders */
router.get('/all/:token', async (req, res) => {
  try {
    const tokenFromClient = req.params.token;
    const correctToken = process.env.ADMIN_TOKEN;

    if (tokenFromClient !== correctToken) {
      console.error('Wrong token input!');
      return res.status(401).json({
        message: 'You need to have the correct token to get all orders!',
      });
    }

    const orders = await req.app.locals.db
      .collection('orders')
      .find()
      .toArray();

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ error: 'There are no orders in the database!' });
    }
    res.json(orders);
  } catch (error) {
    console.error('Error while reading all orders', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

/* POST a new order for a user */
router.post('/user', async (req, res) => {
  try {
    const tokenFromClient = req.body.token;
    const correctToken = process.env.USER_TOKEN;

    if (tokenFromClient !== correctToken) {
      console.error('Wrong token input!');
      return res.status(401).json({
        message: 'You need to have the correct token to view your orders!',
      });
    }

    const userId = req.body.user;

    const userOrders = await req.app.locals.db
      .collection('orders')
      .find({ user: userId })
      .toArray();

    if (userOrders.length === 0) {
      return res
        .status(404)
        .json({ message: 'No orders found with this user!' });
    }
    res.json(userOrders);
  } catch (error) {
    console.error('Error while trying to get orders from user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
