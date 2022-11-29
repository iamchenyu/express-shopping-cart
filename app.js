const express = require("express");
const morgan = require("morgan");
const ExpressError = require("./error");
const shoppingCartRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/items", shoppingCartRoutes);

app.use((req, res, next) => {
  const notFoundError = new ExpressError("Page Not Found", 404);
  return next(notFoundError);
});

app.use((error, req, res, next) => {
  let status = error.status || 500;
  let msg = error.message;

  return res.status(status).json({ message: msg, status: status });
});

module.exports = app;
