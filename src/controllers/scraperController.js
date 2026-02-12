const { scrapeListing } = require("../services/scraperService");

async function getListing(req, res) {
  const { url } = req.body;

  try {
    const listing = await scrapeListing(url);

    if (!listing.title && !listing.price && !listing.description) {
      return res.status(422).json({
        success: false,
        error: { message: "Could not extract listing data from the provided URL." },
      });
    }

    return res.status(200).json({
      success: true,
      data: { url, ...listing },
    });
  } catch (err) {
    console.error("Scraper error:", err.message);
    return res.status(502).json({
      success: false,
      error: { message: "Failed to fetch the listing. The page may be unavailable." },
    });
  }
}

module.exports = { getListing };
