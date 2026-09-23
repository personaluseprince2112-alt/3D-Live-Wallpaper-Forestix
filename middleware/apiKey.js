module.exports = (req, res, next) => {
  const clientKey = req.header('x-api-key') || req.query.key;

  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(403).json({
      status: 'success',
      msg: 'Forbidden: Invalid API Key',
    });
  }
  next();
};
