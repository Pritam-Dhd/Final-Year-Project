import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "issues", required: true },
    amount: { type: Number, required: true },
    reason: { type:String, required: true},
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    paid_date:{type:Date},
    paidType:{type:String},
    transaction_code:{type:String},
});

const Fine = mongoose.model("fines", fineSchema);

export default Fine;
