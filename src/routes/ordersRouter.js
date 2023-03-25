const express = require('express');
const ordersController = require('../controllers/ordersController');
const authHelper = require('../helpers/auth');

const router = express.Router();

router.post('/', ordersController.addOrder);
router.get('/', authHelper.verifyToken, ordersController.getOrders);
router.get(
  '/:idOrCode',
  authHelper.verifyToken,
  ordersController.getOrderByIdOrCode
);
router.put(
  '/:idOrCode',
  authHelper.verifyToken,
  ordersController.updateOrderStatusByIdOrCode
);

module.exports = router;
