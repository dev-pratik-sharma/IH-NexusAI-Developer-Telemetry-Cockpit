// Centralized middleware to intercept and format all application routing errors
const errorHandler = (err, req, res, next) => {
  console.error(`❌ System Exception Intercepted: ${err.message}`);

  // Determine standard status classification codes
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected operational breakdown occurred within the core cluster.',
    timestamp: new Date().toISOString(),
    // Only return the exact error trace sequence during development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
