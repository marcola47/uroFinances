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
    lowercase: true,
    trim: true,
    unique: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please provide a valid email address.']
  },

  password: {
    type: String,
    validate: {
      validator: function(this: any, value: string) {
        return this.providerID !== null || value !== undefined;
      }, message: 'Password is required when providerID is null.'
    }
  },

  emailVerified: {
    type: Boolean,
    default: false,
    required: true
  },

  provider: {
    type: String,
    required: true,
    enum: ['google', 'github', 'credentials']
  },

  providerID: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },

  purchases: {
    type: [purchaseSchema],
    required: false
  }
});

userSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.User || mongoose.model('User', userSchema);
