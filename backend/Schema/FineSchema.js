import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "issues", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    paid_date:{type:Date}
});

const Fine = mongoose.model("fines", fineSchema);

export default Fine;
