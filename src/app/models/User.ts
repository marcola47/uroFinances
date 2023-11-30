import mongoose from "mongoose";
import idSchema from './_id';

const userAccountSchema = new mongoose.Schema({
  id: idSchema,

  name: {
    type: String,
    required: true,
    maxlength: 128
  },

  type: {
    type: String,
    enum: ['checking', 'savings', 'wallet'],
    required: true
  },

  icon: {
    type: String,
    required: false
  }
  
}, { _id: false })

const userCategorySchema = new mongoose.Schema({
  id: idSchema,

  name: {
    type: String,
    required: true,
    maxlength: 128
  },

  icon: {
    type: String,
    default: 'uncategorized',
    required: true
  },

  color: {
    type: String,
    default: '#ffffff',
    required: true,
    maxlength: 7
  },

  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },

  parent: {
    type: String,
    required: false
  },

  grandparent: {
    type: String,
    required: false
  }
}, { _id: false })

const userSchema = new mongoose.Schema({
  id: idSchema,

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

  image: {
    type: String,
    default: null,
    required: false
  },

  accounts: {
    type: [userAccountSchema],
    default: [{ id: "2d593098-48b9-40cc-bb4f-7e71f38a71c9", name: "Main Account", type: "checking", icon: "default" }],
    required: true
  },

  categories: {
    type: [userCategorySchema],
    required: false,
  },

  settings: {
    open_navbar_on_hover: {
      type: Boolean,
      default: false,
      required: true
    },

    hide_scrollbars: {
      type: Boolean,
      default: false,
      required: true
    },

    dark_mode: {
      type: Boolean,
      default: true,
      required: true
    },
    
    show_category_icons: {
      type: Boolean,
      default: false,
      required: true
    }
  }
});

userSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.User || mongoose.model('User', userSchema);
