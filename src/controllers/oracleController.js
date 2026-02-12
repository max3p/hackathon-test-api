function askOracle(req, res) {
  const { question } = req.body;

  // TODO: Replace hardcoded answer with actual oracle logic
  const answer = "yes";

  res.status(200).json({
    success: true,
    data: {
      question,
      answer,
    },
  });
}

module.exports = { askOracle };
