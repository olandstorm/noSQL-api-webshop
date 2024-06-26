const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const categoryRouter = require('./routes/categories');

const app = express();

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGODB_SERVER, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log('Databasen is up and running! Och vi har kontakt!');

  const db = client.db('oskar-landstrom');
  app.locals.db = db;
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoryRouter);

module.exports = app;
