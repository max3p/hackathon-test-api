function validateQuestion(req, res, next) {
  const { question } = req.body;

  if (typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message:
          "A non-empty 'question' string is required in the request body.",
      },
    });
  }

  req.body.question = question.trim();
  next();
}

module.exports = validateQuestion;
