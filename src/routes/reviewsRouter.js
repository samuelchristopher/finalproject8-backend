const express = require('express');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.post('/', reviewsController.addReview);
router.get('/', reviewsController.getReviews);
router.get('/:id', reviewsController.getReviewById);
router.put('/:id', reviewsController.updateReviewById);
router.delete('/:id', reviewsController.deleteReviewById);

module.exports = router;
