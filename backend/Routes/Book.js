import {
    addBook,
    editBook,
    deleteBook,
    getAllBooks,
    getTotalBooks,
  } from "../Controller/BookController.js";
  import { checkAuth } from "../Middleware/CheckAuth.js";
  import express from "express";
  
  const router = express.Router();
  
  router.post("/add-book", checkAuth, async (req, res) => {
    const data = req.body;
    try {
      const message = await addBook({ data, userRole: req.userRole });
      res.send(message);
    } catch (error) {
      res.send("Error adding book" + error.message);
      console.log(error);
    }
  });
  
  router.get("/get-all-books", checkAuth, async (req, res) => {
    try {
      const message = await getAllBooks({ userRole: req.userRole });
      res.send(message);
    } catch (error) {
      res.send("Error getting all books" + error.message);
      console.log(error);
    }
  });
  
  router.post("/edit-book", checkAuth, async (req, res) => {
    const data = req.body;
    try {
      const message = await editBook({ data, userRole: req.userRole });
      res.send(message);
    } catch (error) {
      res.send("Error editing book" + error.message);
      console.log(error);
    }
  });
  
  router.post("/delete-book", checkAuth, async (req, res) => {
    const data = req.body;
    try {
      const message = await deleteBook({data, userRole: req.userRole });
      res.send(message);
    } catch (error) {
      res.send("Error deleting book" + error.message);
      console.log(error);
    }
  });
  
  router.get("/get-total-books", checkAuth, async (req, res) => {
    try {
      const message = await getTotalBooks({ userRole: req.userRole });
      res.send(message);
    } catch (error) {
      res.send("Error deleting author" + error.message);
      console.log(error);
    }
  });
  
  export default router;
  