import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "issues" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    requestDate: { type: Date,required: true },
    requestType: { type: String,enum:['request issue','extend due date','lost book'], required: true },
    status: { type: String, default: 'pending' },
});

const Request = mongoose.model("requests", requestSchema);

export default Request;
