const express = require('express');
const ordersController = require('../controllers/ordersController');

const router = express.Router();

router.post('/', ordersController.addOrder);
// router.get('/', ordersController.getOrders);
// router.get('/:id', ordersController.getOrderById);
// router.get('/:orderCode', ordersController.getOrderByCode);
// router.get('/:id', ordersController.updateOrderById);
// router.get('/:orderCode', ordersController.updateOrderByCode);

module.exports = router;
