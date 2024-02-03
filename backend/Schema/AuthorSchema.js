import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: { type: String },
});

const Author = mongoose.model("authors", authorSchema);

export default Author;
