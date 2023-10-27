import mongoose from "mongoose";
import idSchema from "./_id";

const TransactionSchema = new mongoose.Schema({
  id: idSchema,

  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 128
  },

  user: {
    type: String,
    ref: "User",
    required: true
  },

  account: {
    type: String,
    default: "2d593098-48b9-40cc-bb4f-7e71f38a71c9",
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: String,
    default: "968c0feb-a19d-41d2-a501-c1b365cd541f",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  due_date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  confirmed: {
    type: Boolean,
    default: true,
    required: true,
  },

  recurring: {
    type: Boolean,
    required: false
  },

  recurring_period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: false
  },

  in_stallments: {
    type: Boolean,
    required: false
  },

  stallments_count : {
    type: Number,
    required: false
  }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);