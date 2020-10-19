const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || "localhost:27017/twitter-clone");
const news = db.get("news");

const filter = new Filter();

app.use(cors()); //
app.use(express.json()); //JSON Parse Middleware

app.get("/", (request, response) => {
  response.json({
    message: "This a Get request!😃",
  });
});

app.get("/news", (req, res) => {
  news.find().then((newsJsonData) => {
    res.json(newsJsonData);
  });
});

function isValidNew(newJsonData) {
  return (
    newJsonData.name &&
    newJsonData.name.toString().trim() !== "" &&
    newJsonData.content &&
    newJsonData.content.toString().trim() !== ""
  );
}

app.use(
  rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1, // limit each IP to 1 requests per windowMs
  })
);

app.post("/news", (req, res) => {
  if (isValidNew(req.body)) {
    //insert into db
    const newJsonData = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created_date: new Date(),
    };

    news.insert(newJsonData).then((createdNew) => {
      res.json(createdNew);
    });
  } else {
    res.status(422);
    res.json({
      message: "Name and Content are required!",
    });
  }
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000/");
});
