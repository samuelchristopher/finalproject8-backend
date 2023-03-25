const express = require('express');
const ordersController = require('../controllers/ordersController');
const authHelper = require('../helpers/auth');

const router = express.Router();

router.post('/', ordersController.addOrder);
router.get('/', ordersController.getOrders);
router.get('/:idOrCode', ordersController.getOrderByIdOrCode);
router.put(
  '/:idOrCode',
  authHelper.verifyToken,
  ordersController.updateOrderStatusByIdOrCode
);

module.exports = router;
