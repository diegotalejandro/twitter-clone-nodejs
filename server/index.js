const express = require("express");

const app = express();

app.get("/", (request, response) => {
  response.json({
    message: "This a Get request!😃",
  });
});

app.post("/new", (req, res) => {
  console.log(req.body);
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000/");
});
