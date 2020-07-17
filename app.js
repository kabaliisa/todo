import express from "express";
import db from "./db/db";
const app = express();

app.get("/api/v1/todos", function (req, res) {
  res.status(200).send({
    success: "true",
    message: "todos retrieved successfully",
    todo: db,
  });
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
