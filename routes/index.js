import express from "express";
import db from "../db/db";
import models from "../models";

const router = express.Router();

router.get("/api/v1/todos", function (req, res) {
  models.Todo.findAll().then((todos) => {
    res.status(200).send({
      success: "true",
      message: "todos retrieved successfully",
      todo: todos,
    });
  });
  // res.status(200).send({
  //   success: "true",
  //   message: "todos retrieved successfully",
  //   todo: db,
  // });
});

router.post("/api/v1/todos", (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      success: "false",
      message: "title is required",
    });
  }

  models.Todo.findOne({
    where: { title: req.body.title },
  }).then((todoFound) => {
    if (todoFound) {
      return res.status(403).send({
        success: "true",
        message: "A todo ith that title already exists",
      });
    }
  });

  const todo = {
    title: req.body.title,
  };
  models.Todo.create(todo).then((todo) => {
    return res.status(201).send({
      success: "true",
      message: "todo added successfully",
      todo,
    });
  });
});

router.get("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  models.Todo.findByPk(id).then((todo) => {
    if (todo) {
      return res.status(200).send({
        success: "true",
        message: "todo retrieved successfully",
        todo,
      });
    } else {
      return res.status(400).send({
        success: "false",
        message: "todo does not exist",
      });
    }
  });
});

router.delete("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo, index) => {
    if (todo.id === id) {
      db.splice(index, 1);
      return res.status(200).send({
        success: "true",
        message: "Todo deleted successfuly",
      });
    }
  });

  return res.status(404).send({
    success: "false",
    message: "todo not found",
  });
});

router.put("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  let todoFound;
  let itemIndex;
  db.map((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: "false",
      message: "todo not found",
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: "false",
      message: "title is required",
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: "false",
      message: "description is required",
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(201).send({
    success: "true",
    message: "todo added successfully",
    updatedTodo,
  });
});

export default router;
