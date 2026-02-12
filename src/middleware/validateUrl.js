function validateUrl(req, res, next) {
  const { url } = req.body;

  if (typeof url !== "string" || url.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: "A non-empty 'url' string is required in the request body." },
    });
  }

  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes("kijiji.ca")) {
      return res.status(400).json({
        success: false,
        error: { message: "Only Kijiji URLs are supported." },
      });
    }
  } catch {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid URL format." },
    });
  }

  req.body.url = url.trim();
  next();
}

module.exports = validateUrl;
