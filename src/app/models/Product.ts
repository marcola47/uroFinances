import mongoose from 'mongoose';
import idSchema from './_id';

const productSchema = new mongoose.Schema({
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

  category: {
    type: String,
    ref: 'Category',
    default: 'Uncategorized',
    required: false
  },

  unit: {
    type: String,
    required: true,
    maxlength: 16
  }
});

productSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.product || mongoose.model('Product', productSchema);