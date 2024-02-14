import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  authors: [
    { type: mongoose.Schema.Types.ObjectId, ref: "authors", required: true },
  ],
  genres: [
    { type: mongoose.Schema.Types.ObjectId, ref: "genres", required: true },
  ],
  publishers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "publishers", required: true },
  ],
  ISBN: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  description: { type: String },
  totalBooks: { type: Number, required: true },
  availableBooks: { type: Number, required: true },
  image:{type:String}
});

const Book = mongoose.model("books", bookSchema);

export default Book;
