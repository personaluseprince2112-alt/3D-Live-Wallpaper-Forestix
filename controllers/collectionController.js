const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ImageCollection = require('../models/collectionModel');
const DepthWallpaper = require('../models/depthWallpaperModel');

exports.getAllCollections = catchAsync(async (req, res, next) => {
  const isDepth = req.query.type === 'depth';

  let query = ImageCollection.find();

  if (isDepth) {
    query = query.populate({
      path: 'depthImages',
      select: 'back depth thumb strength clockEnabled clockX clockY clockSize clockColor clockFont clockDepth colorType gradientColors charColors dateEnabled datePosition dateColor dateSize dateAlignment clockFormat dateFont clockLayout clockLineGap hourColor minuteColor dateX dateY datePattern dateLineGap dateCapitalText clockBlendMode dateBlendMode clockStrokeWidth clockStrokeColor dateStrokeWidth dateStrokeColor imageTags blurHash createdAt setCount points',
    });
  } else {
    query = query.populate({
      path: 'images',
      select: 'imageUrl -imageCollection',
    });
  }

  let collections = await query;

  collections = collections.map((collection) => {
    const imagesList = isDepth ? (collection.depthImages || []) : (collection.images || []);
    const shuffled = [...imagesList].sort(() => 0.5 - Math.random());
    
    const colObj = collection.toObject();
    
    // For depth, map depthImages to images property for frontend compatibility
    if (isDepth) {
      colObj.images = shuffled.slice(0, 6);
      delete colObj.depthImages;
    } else {
      colObj.images = shuffled.slice(0, 6);
    }
    
    return colObj;
  });

  res.status(200).json({
    status: 'success',
    results: collections.length,
    data: collections,
  });
});

exports.getCollection = catchAsync(async (req, res, next) => {
  const isDepth = req.query.type === 'depth';

  let query = ImageCollection.findById(req.params.id);

  if (isDepth) {
    query = query.populate({
      path: 'depthImages',
      select: '-__v',
    });
  } else {
    query = query.populate({
      path: 'images',
      select: '-__v',
    });
  }

  const data = await query;

  if (!data) {
    return next(new AppError('No data found with that id', 404));
  }

  const colObj = data.toObject();
  
  if (isDepth) {
    colObj.images = colObj.depthImages || [];
    delete colObj.depthImages;
  }

  res.status(200).json({
    status: 'success',
    data: colObj,
  });
});

exports.updateCollection = catchAsync(async (req, res, next) => {
  const data = await ImageCollection.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!data) {
    return next(new AppError('No data found with that id', 404));
  }

  res.status(201).json({
    status: 'success',
    data,
  });
});
