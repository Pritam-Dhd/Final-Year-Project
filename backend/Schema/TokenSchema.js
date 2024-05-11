import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token:{type:String},
    expiryDate:{type:Date},
    email:{type:String},
    status:{type:String}
})

const Token = mongoose.model("tokens", tokenSchema);

export default Token;