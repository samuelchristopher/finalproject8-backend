const express = require('express');
const categoriesController = require('../controllers/categoriesController');

const router = express.Router();

router.post('/', categoriesController.addCategory);
router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.put('/:id', categoriesController.updateCategoryById);
router.delete('/:id', categoriesController.deleteCategoryById);

module.exports = router;
