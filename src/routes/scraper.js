const { Router } = require("express");
const { getListing } = require("../controllers/scraperController");
const validateUrl = require("../middleware/validateUrl");

const router = Router();

router.post("/listing", validateUrl, getListing);

module.exports = router;
