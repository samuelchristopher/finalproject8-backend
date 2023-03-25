const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const authHelper = require('../helpers/auth');

const router = express.Router();

router.post('/', reviewsController.addReview);
router.get('/', reviewsController.getReviews);
router.get('/:id', reviewsController.getReviewById);
router.put('/:id', authHelper.verifyToken, reviewsController.updateReviewById);
router.delete(
  '/:id',
  authHelper.verifyToken,
  reviewsController.deleteReviewById
);

module.exports = router;
