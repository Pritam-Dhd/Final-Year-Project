import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name:{type:String}
})

const Role = mongoose.model("roles", roleSchema);

export default Role;