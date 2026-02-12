const { Router } = require("express");
const { askOracle } = require("../controllers/oracleController");
const validateQuestion = require("../middleware/validateQuestion");

const router = Router();

router.post("/ask", validateQuestion, askOracle);

module.exports = router;
