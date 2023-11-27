import mongoose from "mongoose";

const EmailTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },

  user: {
    type: String,
    ref: 'User',
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  verified_at: {
    type: Date,
    default: null
  },
});

EmailTokenSchema.index({ token: 1 }, { unique: true });
export default mongoose.models.EmailToken || mongoose.model('EmailToken', EmailTokenSchema);