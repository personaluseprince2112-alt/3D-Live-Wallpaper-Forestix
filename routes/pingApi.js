const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.route('/').get(imageController.pingApi);

module.exports = router;
