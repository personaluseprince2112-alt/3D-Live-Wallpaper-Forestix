const mongoose = require('mongoose');
const DepthWallpaper = require('./../models/depthWallpaperModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllDepthWallpapers = catchAsync(async (req, res, next) => {
  // Pagination setup
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const limit = Math.max(1, parseInt(req.query.limit)) || 100;
  const skip = (page - 1) * limit;

  // Filters
  const tagQuery = req.query.search?.trim();
  const isRandom = tagQuery?.toLowerCase() === 'random';

  let collectionFilter = {};
  if (req.query.collectionId) {
    if (mongoose.Types.ObjectId.isValid(req.query.collectionId)) {
      collectionFilter = {
        imageCollection: new mongoose.Types.ObjectId(req.query.collectionId),
      };
    } else {
      collectionFilter = { imageCollection: new mongoose.Types.ObjectId() };
    }
  }

  const tagFilter =
    !isRandom && tagQuery
      ? {
          imageTags: {
            $elemMatch: {
              $regex: new RegExp(tagQuery, 'i'),
            },
          },
        }
      : {};

  const finalFilter = { ...tagFilter, ...collectionFilter };

  // 🔹 RANDOM DEPTH WALLPAPERS
  if (isRandom) {
    const total = await DepthWallpaper.countDocuments(collectionFilter);
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Page number exceeds total pages',
      });
    }

    // Get random samples matching the collection filter if provided
    let data = await DepthWallpaper.aggregate([
      { $match: collectionFilter },
      { $sample: { size: limit } },
    ]);

    // Populate collection details
    data = await DepthWallpaper.populate(data, {
      path: 'imageCollection',
      select: 'name coverImageUrl',
    });

    // Mongoose aggregate returns plain JS objects, map _id to virtual id for consistency
    const formattedData = data.map((doc) => {
      const formatted = { ...doc };
      if (doc._id) {
        formatted.id = doc._id.toString();
      }
      return formatted;
    });

    return res.status(200).json({
      status: 'success',
      results: formattedData.length,
      page,
      totalPages,
      totalItems: total,
      data: formattedData,
    });
  }

  // 🔹 NORMAL FILTERED DEPTH WALLPAPERS
  const allowedSortFields = ['createdAt', '-createdAt', 'setCount', '-setCount'];
  const sort = allowedSortFields.includes(req.query.sort)
    ? req.query.sort
    : '-createdAt';

  const total = await DepthWallpaper.countDocuments(finalFilter);
  const totalPages = Math.ceil(total / limit);

  if (page > totalPages && total > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Page number exceeds total pages',
    });
  }

  const data = await DepthWallpaper.find(finalFilter)
    .populate('imageCollection', 'name coverImageUrl')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    results: data.length,
    page,
    totalPages,
    totalItems: total,
    data,
  });
});

exports.getDepthWallpaper = catchAsync(async (req, res, next) => {
  const doc = await DepthWallpaper.findById(req.params.id).populate(
    'imageCollection',
    'name coverImageUrl',
  );

  if (!doc) {
    return next(new AppError('No depth wallpaper found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.incrementSetCount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const wallpaper = await DepthWallpaper.findByIdAndUpdate(
    id,
    { $inc: { setCount: 1 } },
    { new: true, runValidators: true },
  ).populate('imageCollection', 'name coverImageUrl');

  if (!wallpaper) {
    return next(new AppError('Depth wallpaper not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Wallpaper set count increased',
    data: wallpaper,
  });
});
