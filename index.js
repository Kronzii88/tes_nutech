/**
 * 20 Oktober 2024
 * index
 */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());

app.options("*", cors());

const routes = require("./routes");
routes(app);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
