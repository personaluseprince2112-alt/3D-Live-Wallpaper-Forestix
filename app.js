const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const globleErrorHandler = require('./controllers/errorController.js');
const imageRoutes = require('./routes/imageRoutes.js');
const pingApi = require('./routes/pingApi.js');
const collectionRoutes = require('./routes/collectionRoutes.js');
const depthWallpaperRoutes = require('./routes/depthWallpaperRoutes.js');
const AppError = require('./utils/appError.js');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

// start express app
const app = express();

// Trust the first proxy (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same api
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limit);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

app.use(cors());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes
app.use('/api/v1/wallpaper/ping', pingApi);
app.use('/api/v1/wallpaper/image', imageRoutes);
app.use('/api/v1/wallpaper/collection', collectionRoutes);
app.use('/api/v1/wallpaper/depth', depthWallpaperRoutes);
app.use('/api/v1/depth-wallpapers', depthWallpaperRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globleErrorHandler);

module.exports = app;
