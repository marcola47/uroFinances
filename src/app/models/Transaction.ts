import mongoose from "mongoose";
import idSchema from "./_id";

const TransactionCategorySchema = new mongoose.Schema({
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
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: TransactionCategorySchema,
    required: false,
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  registration_date: {
    type: Date,
    default: Date.now,
    required: true,
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
    default: false,
    required: true
  },

  recurring_period: {
    type: String,
    default: undefined,
    enum: ["monthly", "quarterly", "semi-annual", "annual"],
    required: false
  },

  recurring_months: {
    type: [Number],
    default: undefined,
    required: false
  },

  recurring_months_paid: {
    type: [{ due_month: Date, paid_month: Date }, { _id: false }],
    default: undefined,
    required: false
  },

  in_stallments: {
    type: Boolean,
    default: false,
    required: true
  },

  in_stallments_count: {
    type: Number,
    default: undefined,
    required: false,
    min: 1
  },

  in_stallments_current: {
    type: Number,
    default: undefined,
    required: false,
    min: 1
  },

  in_stallments_period: {
    type: String,
    default: undefined,
    enum: ["monthly", "quarterly", "semi-annual", "annual"],
    required: false
  }
}, { timestamps: false });

//fill recurring_months
TransactionSchema.pre('save', function(next) {
  if ((this.isModified('due_date') || this.isNew) && this.recurring) {
    const newDate: Date = new Date(this.due_date);
    const startMonth: number = newDate.getMonth();
    const chargeMonths: number[] = [];
    let period: number = 0;
  
    switch (this.recurring_period) {
      case 'monthly'    : period = 1;  break;
      case 'quarterly'  : period = 3;  break;
      case 'semi-annual': period = 6;  break;
      case 'annual'     : period = 12; break;
      default: break;
    }
  
    for (let i = period; i <= 12; i += period) 
      if (!chargeMonths.includes((startMonth + i) % 12))
        chargeMonths.push((startMonth + i) % 12);
  
    this.recurring_months = chargeMonths;
  }

  next();
})

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);