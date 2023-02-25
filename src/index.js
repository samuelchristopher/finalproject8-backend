require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const router = require('./routes/router');
// const categoriesRouter = require('./routes/categoriesRouter');
// const productsRouter = require('./routes/productsRouter');
// const productImgRouter = require('./routes/productImgRouter');
// const reviewRouter = require('./routes/reviewRouter');
// const ordersRouter = require('./routes/ordersRouter');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

sequelize
  .authenticate()
  .then(function (err) {
    console.log('Database connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  });

app.use('/', router);
// app.use('/categories', categoriesRouter);
// app.use('/products', productsRouter);
// app.use('/product-images', productImgRouter);
// app.use('/reviews', reviewRouter);
// app.use('/orders', ordersRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server Running on port: ${process.env.SERVER_PORT}`);
});
