const mongoose = require('mongoose');

const depthWallpaperSchema = new mongoose.Schema({
  back: {
    type: String,
    required: [true, 'A wallpaper must have a background image URL/path'],
  },
  depth: {
    type: String,
    required: [true, 'A wallpaper must have a depth image URL/path'],
  },
  thumb: {
    type: String,
    required: [true, 'A wallpaper must have a thumbnail image URL/path'],
  },
  strength: {
    type: Number,
    default: 0.95,
  },
  depthCenter: {
    type: Number,
    default: 1.0,
  },
  zoom: {
    type: Number,
    default: 0.22,
  },
  zoom3d: {
    type: Number,
    default: 0.15,
  },
  clockEnabled: {
    type: Boolean,
    default: true,
  },
  clockX: {
    type: Number,
    default: 0.53,
  },
  clockY: {
    type: Number,
    default: 0.34,
  },
  clockSize: {
    type: Number,
    default: 180.0,
  },
  clockColor: {
    type: String,
    default: '#FFFFFF',
  },
  clockFont: {
    type: String,
    default: 'abeatbykai_regular',
  },
  clockDepth: {
    type: Number,
    default: 0.57,
  },
  colorType: {
    type: String,
    default: 'gradient',
  },
  gradientColors: {
    type: [String],
    default: ['#FFFFFF', '#FFFFFF'],
  },
  charColors: {
    type: [String],
    default: ['#FF5252', '#FFD700'],
  },
  dateEnabled: {
    type: Boolean,
    default: true,
  },
  datePosition: {
    type: String,
    default: 'top',
  },
  dateColor: {
    type: String,
    default: '#FFFFFF',
  },
  dateSize: {
    type: Number,
    default: 36.5,
  },
  dateAlignment: {
    type: String,
    default: 'start',
  },
  clockFormat: {
    type: String,
    default: '12',
  },
  dateFont: {
    type: String,
    default: 'abeatbykai_regular',
  },
  clockLayout: {
    type: String,
    default: 'horizontal',
  },
  clockLineGap: {
    type: Number,
    default: 12.0,
  },
  hourColor: {
    type: String,
    default: '#FFFFFF',
  },
  minuteColor: {
    type: String,
    default: '#FFFFFF',
  },
  dateX: {
    type: Number,
    default: 0.41,
  },
  dateY: {
    type: Number,
    default: 0.29,
  },
  datePattern: {
    type: String,
    default: 'EEE, MMM d',
  },
  dateLineGap: {
    type: Number,
    default: 6.0,
  },
  dateCapitalText: {
    type: Boolean,
    default: true,
  },
  clockBlendMode: {
    type: String,
    default: 'NORMAL',
  },
  dateBlendMode: {
    type: String,
    default: 'NORMAL',
  },
  clockStrokeWidth: {
    type: Number,
    default: 0.0,
  },
  clockStrokeColor: {
    type: String,
    default: '#000000',
  },
  dateStrokeWidth: {
    type: Number,
    default: 0.0,
  },
  dateStrokeColor: {
    type: String,
    default: '#000000',
  },
  imageCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageCollection',
    default: null,
  },
  imageTags: {
    type: [String],
    default: ['Wallpaper'],
  },
  points: {
    type: Number,
    default: 0,
  },
  blurHash: {
    type: String,
    default: '',
  },
  setCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Configure Mongoose to virtualize _id into a string 'id' field in JSON and Objects
depthWallpaperSchema.set('toJSON', { virtuals: true });
depthWallpaperSchema.set('toObject', { virtuals: true });

const DepthWallpaper = mongoose.model('DepthWallpaper', depthWallpaperSchema);
module.exports = DepthWallpaper;
