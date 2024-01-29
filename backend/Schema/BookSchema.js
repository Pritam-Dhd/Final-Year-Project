import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String },
  
});

const Book = mongoose.model("books", bookSchema);

export default Book;
