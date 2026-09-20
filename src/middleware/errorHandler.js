const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: {
        message: `${field} already exists`,
        field
      }
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
