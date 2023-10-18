import mongoose from "mongoose";
import idSchema from './_id';

const categorySchema = new mongoose.Schema({
  id: idSchema,

  name: {
    type: String,
    required: true,
    maxlength: 128
  },

  owner: {
    type: String,
    ref: 'User',
    required: true
  },

  icon: {
    type: String,
    required: false
  }
})

categorySchema.index({ id: 1 }, { unique: true });
export default mongoose.models.Category || mongoose.model('Category', categorySchema);