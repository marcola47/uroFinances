import mongoose from "mongoose";
import idSchema from './_id';

const storeSchema = new mongoose.Schema(
{
  id: idSchema,

  name:
  {
    type: String,
    required: true,
    maxlength: 128
  },

  location:
  {
    type: String,
    default: null,
    required: false,
    maxlength: 128
  },
})

storeSchema.index({ id: 1 }, { unique: true });
export default mongoose.models.Store || mongoose.model('Store', storeSchema);