require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoute = require('./routes/authRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const productsRouter = require('./routes/productsRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const ordersRouter = require('./routes/ordersRouter');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database: ', err);
  });

app.use('/auth', authRoute);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/reviews', reviewsRouter);
app.use('/orders', ordersRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server Running on port: ${process.env.SERVER_PORT}`);
});
