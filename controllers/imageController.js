const Image = require('./../models/imageModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

function optimizeCloudinaryUrl(originalUrl, width = 1080, height = 1920) {
  if (!originalUrl || !originalUrl.includes('/upload/')) return originalUrl;

  return originalUrl.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`,
  );
}
// ✅ Main Controller
exports.getAllImages = catchAsync(async (req, res, next) => {
  // Pagination setup
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const limit = Math.max(1, parseInt(req.query.limit)) || 100;
  const skip = (page - 1) * limit;

  // Search / Filters
  const tagQuery = req.query.search?.trim();
  const isRandom = tagQuery === 'random';

  const collectionFilter = req.query.collectionId
    ? { imageCollection: req.query.collectionId }
    : {};

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

  // 🔹 RANDOM IMAGES
  if (isRandom) {
    const total = await Image.countDocuments();
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Page number exceeds total pages',
      });
    }

    const data = await Image.aggregate([{ $sample: { size: limit } }]);

    // ✅ Replace imageUrl with optimized URL
    const optimizedRandom = data.map((img) => ({
      ...img,
      imageUrl: optimizeCloudinaryUrl(img.imageUrl),
    }));

    return res.status(200).json({
      status: 'success',
      results: optimizedRandom.length,
      page,
      totalPages,
      totalItems: total,
      data: optimizedRandom,
    });
  }

  // 🔹 NORMAL FILTERED IMAGES
  const allowedSortFields = ['createdAt', '-setCount', '-createdAt'];
  const sort = allowedSortFields.includes(req.query.sort)
    ? req.query.sort
    : '-createdAt';

  const total = await Image.countDocuments(finalFilter);
  const totalPages = Math.ceil(total / limit);

  if (page > totalPages && total > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Page number exceeds total pages',
    });
  }

  const data = await Image.find(finalFilter).sort(sort).skip(skip).limit(limit);

  // ✅ Replace each imageUrl with optimized version
  const optimizedData = data.map((img) => ({
    ...img._doc,
    imageUrl: optimizeCloudinaryUrl(img.imageUrl),
  }));

  res.status(200).json({
    status: 'success',
    results: optimizedData.length,
    page,
    totalPages,
    totalItems: total,
    data: optimizedData,
  });
});

exports.updateImage = catchAsync(async (req, res, next) => {
  const doc = await Image.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No doc found with that id', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.getImage = catchAsync(async (req, res, next) => {
  const doc = await Image.findById(req.params.id);

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.incrementSetCount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const image = await Image.findByIdAndUpdate(
    id,
    {
      $inc: { setCount: 1 },
    },
    { new: true },
  );

  if (!image) return next(new AppError('Image not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Wallpaper set count increased',
    data: image,
  });
});

exports.pingApi = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'ping',
  });
});
