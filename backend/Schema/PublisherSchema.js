import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
  name: { type: String },
});

const Publisher = mongoose.model("publishers", publisherSchema);

export default Publisher;
