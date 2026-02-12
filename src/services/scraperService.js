const cheerio = require("cheerio");

function parseListingFromHtml(html) {
  const $ = cheerio.load(html);
  const listing = {};

  // 1. Try JSON-LD structured data (cleanest source)
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data["@type"] === "Product" || data["@type"] === "Offer") {
        listing.title = listing.title || data.name;
        listing.description = listing.description || data.description;
        if (data.offers?.price) {
          listing.price = `$${data.offers.price}`;
        } else if (data.price) {
          listing.price = `$${data.price}`;
        }
      }
    } catch {}
  });

  // 2. Try __NEXT_DATA__ (Next.js page props with Apollo state)
  const nextDataScript = $("#__NEXT_DATA__").html();
  if (nextDataScript) {
    try {
      const nextData = JSON.parse(nextDataScript);
      const apolloState = nextData?.props?.pageProps?.initialApolloState ||
                          nextData?.props?.pageProps?.__APOLLO_STATE__;

      if (apolloState) {
        for (const key of Object.keys(apolloState)) {
          const node = apolloState[key];
          if (node?.title && node?.__typename?.includes("Listing")) {
            listing.title = listing.title || node.title;
            listing.description = listing.description || node.description;
            if (node.price?.amount) {
              listing.price = listing.price || `$${node.price.amount}`;
            }
            if (node.location?.name) {
              listing.location = listing.location || node.location.name;
            }
          }
        }
      }
    } catch {}
  }

  // 3. Fallback to meta tags and page title
  if (!listing.title) {
    listing.title = $('meta[property="og:title"]').attr("content") ||
                    $("title").text().split("|")[0]?.trim();
  }
  if (!listing.description) {
    listing.description = $('meta[property="og:description"]').attr("content") ||
                          $('meta[name="description"]').attr("content");
  }
  if (!listing.price) {
    const priceText = $('[class*="price" i]').first().text().trim() ||
                      $('[data-testid*="price" i]').first().text().trim();
    if (priceText) listing.price = priceText;
  }
  if (!listing.location) {
    listing.location = $('[class*="location" i]').first().text().trim() ||
                       $('meta[property="og:locality"]').attr("content");
  }

  return listing;
}

async function scrapeListing(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return parseListingFromHtml(html);
}

module.exports = { scrapeListing };
