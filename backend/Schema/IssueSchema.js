import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "books", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date },
  status: { type: String, enum: ['Returned', 'Not Returned','Lost'],required: true },
});

const Issue = mongoose.model("issues", issueSchema);

export default Issue;
