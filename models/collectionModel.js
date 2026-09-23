const mongoose = require('mongoose');

const imageCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A collection must have a name'],
    unique: true,
  },
  coverImageUrl: {
    type: String,
    default: 'default.jpg',
  },
  coverImageBlurHash: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now, select: false },
});

imageCollectionSchema.virtual('images', {
  ref: 'Image',
  foreignField: 'imageCollection', // field in Image model
  localField: '_id',
});

imageCollectionSchema.virtual('depthImages', {
  ref: 'DepthWallpaper',
  foreignField: 'imageCollection', // field in DepthWallpaper model
  localField: '_id',
});

// Ensure virtuals are included in JSON
imageCollectionSchema.set('toObject', { virtuals: true });
imageCollectionSchema.set('toJSON', { virtuals: true });

const imageCollection = mongoose.model(
  'ImageCollection',
  imageCollectionSchema,
);
module.exports = imageCollection;
