import mongoose from 'mongoose';
import idSchema from './_id';

const ListSchema = new mongoose.Schema(
{
  id: idSchema,

  name:
  {
    type: String,
    required: true,
    maxlength: 128
  },

  owner:
  {
    type: String,
    ref: 'User',
    required: true
  },

  items:
  {
    type: [String],
    default: [],
    required: true
  },

  store:
  {
    type: String,
    ref: 'Store',
    default: null,
    required: false
  }
});

ListSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.List || mongoose.model('List', ListSchema);