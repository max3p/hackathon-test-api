const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
