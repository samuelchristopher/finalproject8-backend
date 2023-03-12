const express = require('express');
const ordersController = require('../controllers/ordersController');

const router = express.Router();

router.post('/', ordersController.addOrder);
router.get('/', ordersController.getOrders);
router.get('/:idOrCode', ordersController.getOrderByIdOrCode);
// router.get('/:idOrCode', ordersController.updateOrderByIdOrCode);

module.exports = router;
