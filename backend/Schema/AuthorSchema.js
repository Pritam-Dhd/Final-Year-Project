import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  ISBN: { type: "string" },
  name: { type: String },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genres",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authors",
  },
  publication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "publications",
  },
  publishedYear: { type: Number },
  totalBooks:{ type: Number}
});

const Author = mongoose.model("authors", authorSchema);

export default Author;
