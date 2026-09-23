const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'A app must have a imageUrl'],
  },
  publicId: { type: String },
  imageTags: {
    type: [String],
    default: ['Wallpaper'],
  },
  imageBlurHash: { type: String },
  imageCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageCollection',
  },
  setCount: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
