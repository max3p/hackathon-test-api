function errorHandler(err, req, res, next) {
  // Handle malformed JSON from express.json()
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: { message: "Malformed JSON in request body." },
    });
  }

  console.error("Unhandled error:", err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? "Internal server error." : err.message,
    },
  });
}

module.exports = errorHandler;
