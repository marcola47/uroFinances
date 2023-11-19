import mongoose from "mongoose";
import idSchema from "./_id";

const RecurrenceCategorySchema = new mongoose.Schema({
  root: {
    type: String,
    required: false,
  },

  child: {
    type: String,
    required: false,
  },

  grandchild: {
    type: String,
    required: false,
  }

}, { _id: false })

const RecurrenceSchema = new mongoose.Schema({
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
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: RecurrenceCategorySchema,
    required: false,
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  reg_date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  due_date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  recurrence_period: {
    type: String,
    default: undefined,
    enum: ["monthly", "quarterly", "semi-annual", "annual"],
    required: false
  },
}, { timestamps: false });

export default mongoose.models.Recurrence || mongoose.model("Recurrence", RecurrenceSchema);
// I wish I could've done this with discriminators, but, next just deoesn't like it 