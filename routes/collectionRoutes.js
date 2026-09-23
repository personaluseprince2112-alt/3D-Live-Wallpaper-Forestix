const express = require('express');
const apiKey = require('./../middleware/apiKey');
const collectionController = require('./../controllers/collectionController');

const router = express.Router();

router.use(apiKey);

router.route('/').get(collectionController.getAllCollections);

router
  .route('/:id')
  .get(collectionController.getCollection)
  .patch(collectionController.updateCollection);

module.exports = router;
