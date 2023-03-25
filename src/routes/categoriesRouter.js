const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const authHelper = require('../helpers/auth');

const router = express.Router();

router.post('/', authHelper.verifyToken, categoriesController.addCategory);
router.get('/', authHelper.verifyToken, categoriesController.getCategories);
router.get(
  '/:id',
  authHelper.verifyToken,
  categoriesController.getCategoryById
);
router.put(
  '/:id',
  authHelper.verifyToken,
  categoriesController.updateCategoryById
);
router.delete(
  '/:id',
  authHelper.verifyToken,
  categoriesController.deleteCategoryById
);

module.exports = router;
