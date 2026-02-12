const express = require("express");
const cors = require("cors");
const oracleRoutes = require("./routes/oracle");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ success: true, data: { message: "hello" } });
});

app.use("/api/oracle", oracleRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Cannot ${req.method} ${req.path}` },
  });
});

app.use(errorHandler);

module.exports = app;
