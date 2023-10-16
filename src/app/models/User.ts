import mongoose from "mongoose";
import idSchema from './_id';

const purchaseSchema = new mongoose.Schema({
  list: {
    type: String,
    ref: 'List',
    required: true
  },

  store: {
    type: String,
    ref: 'Store',
    default: null,
    required: false
  },

  date: {
    type: Date,
    default: Date.now,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be greater than 0']
  }
}, { _id: false })

const userSchema = new mongoose.Schema({
  id: idSchema,
  
  picture: {
    type: String,
    default: null,
    required: false
  },

  name: { 
    type: String, 
    required: true,
    maxlength: 128
  }, 

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please provide a valid email address.']
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  purchases: {
    type: [purchaseSchema],
    required: false
  }
});

userSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.User || mongoose.model('User', userSchema);
