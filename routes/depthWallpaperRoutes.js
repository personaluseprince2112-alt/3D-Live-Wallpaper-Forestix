const express = require('express');
const apiKey = require('./../middleware/apiKey');
const depthWallpaperController = require('./../controllers/depthWallpaperController');

const router = express.Router();

// Protect all routes with API Key verification
router.use(apiKey);

router.route('/').get(depthWallpaperController.getAllDepthWallpapers);

router.route('/:id').get(depthWallpaperController.getDepthWallpaper);

router.route('/:id/increment-set').post(depthWallpaperController.incrementSetCount);

module.exports = router;
