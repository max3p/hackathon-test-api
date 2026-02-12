const OpenAI = require("openai");
const { getOracleAnswer } = require("../services/openaiService");

async function askOracle(req, res) {
  const { question } = req.body;

  try {
    const result = await getOracleAnswer(question);

    if (result.answer === "error") {
      return res.status(400).json({
        success: false,
        error: { message: result.message },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer: result.answer,
      },
    });
  } catch (err) {
    if (err instanceof OpenAI.AuthenticationError) {
      return res.status(500).json({
        success: false,
        error: { message: "Oracle service is misconfigured." },
      });
    }

    if (err instanceof OpenAI.RateLimitError) {
      return res.status(503).json({
        success: false,
        error: { message: "Oracle is overwhelmed. Please try again later." },
      });
    }

    if (err instanceof OpenAI.APIConnectionError) {
      return res.status(502).json({
        success: false,
        error: { message: "Could not reach the oracle. Please try again." },
      });
    }

    if (err instanceof OpenAI.APIError) {
      console.error("OpenAI API error:", err.status, err.message);
      return res.status(502).json({
        success: false,
        error: { message: "Oracle service encountered an error." },
      });
    }

    if (
      err.message?.includes("AI response") ||
      err.message?.includes("AI returned") ||
      err.message?.includes("AI error") ||
      err.message?.includes("OpenAI returned")
    ) {
      console.error("AI response validation error:", err.message);
      return res.status(502).json({
        success: false,
        error: { message: "Oracle gave an invalid response. Please try again." },
      });
    }

    throw err;
  }
}

module.exports = { askOracle };
