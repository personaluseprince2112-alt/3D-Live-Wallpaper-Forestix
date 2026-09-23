const express = require('express');
const apiKey = require('./../middleware/apiKey');
const imageController = require('./../controllers/imageController');

const router = express.Router();

router.use(apiKey);

router.route('/').get(imageController.getAllImages);

router
  .route('/:id')
  .get(imageController.getImage)
  .patch(imageController.updateImage);

router.route('/:id/increment-set').post(imageController.incrementSetCount);

module.exports = router;
