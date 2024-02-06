const express = require('express');
const router = express.Router();

/* GET all categories */
router.get('/', (req, res) => {});

/* POST create a new category */
router.post('/add', async (req, res) => {
  try {
    const tokenFromClient = req.body.token;
    const correctToken = process.env.ADMIN_TOKEN;

    if (tokenFromClient !== correctToken) {
      console.error('Wrong token input!');
      return res.status(401).json({
        message: 'You need to have the correct token to create a new category!',
      });
    }
    const newCategory = {
      name: req.body.name,
    };

    console.log(newCategory);
    await req.app.locals.db.collection('category').insertOne(newCategory);
    res
      .status(201)
      .json({ message: 'The category has been added succesfully!' });
  } catch (error) {
    console.error('Error while trying to add category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
