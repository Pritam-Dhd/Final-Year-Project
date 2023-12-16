import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone_no: { type: String},
  role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
    },
  image: { type: String },
  password: { type: String },
});

const User = mongoose.model("users", userSchema);

export default User;
