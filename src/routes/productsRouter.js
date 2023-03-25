const express = require('express');
const productsController = require('../controllers/productsController');
const authHelper = require('../helpers/auth');

const router = express.Router();

router.post(
  '/',
  [authHelper.verifyToken, productsController.uploadImg],
  productsController.addProduct
);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.put(
  '/:id',
  authHelper.verifyToken,
  productsController.updateProductById
);
router.delete(
  '/:id',
  authHelper.verifyToken,
  productsController.deleteProductById
);

module.exports = router;
