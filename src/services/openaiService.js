const OpenAI = require("openai");
const {
  OPENAI_MODEL,
  OPENAI_TIMEOUT,
  OPENAI_MAX_TOKENS,
  SYSTEM_PROMPT,
} = require("../config/openai");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing OPENAI_API_KEY environment variable. " +
      "Set it in your .env file or system environment before starting the server."
  );
}

const client = new OpenAI({
  apiKey,
  timeout: OPENAI_TIMEOUT,
});

function validateOracleResponse(parsed) {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("AI response is not a JSON object.");
  }

  const { answer, message } = parsed;

  if (answer === "yes") {
    if (Object.keys(parsed).length !== 1) {
      throw new Error("Unexpected extra fields in 'yes' response.");
    }
    return { answer: "yes" };
  }

  if (answer === "no") {
    if (Object.keys(parsed).length !== 1) {
      throw new Error("Unexpected extra fields in 'no' response.");
    }
    return { answer: "no" };
  }

  if (answer === "error") {
    if (typeof message !== "string" || message.trim().length === 0) {
      throw new Error("AI error response missing 'message' string.");
    }
    return { answer: "error", message: message.trim() };
  }

  throw new Error(
    `AI returned invalid answer: "${answer}". Expected "yes", "no", or "error".`
  );
}

async function getOracleAnswer(question) {
  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: OPENAI_MAX_TOKENS,
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  const cleaned = content
    .trim()
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`AI response is not valid JSON: "${content}"`);
  }

  return validateOracleResponse(parsed);
}

module.exports = { getOracleAnswer };
