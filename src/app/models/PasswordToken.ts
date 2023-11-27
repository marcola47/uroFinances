import mongoose from "mongoose";

const PasswordTokenSchema = new mongoose.Schema({
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


PasswordTokenSchema.index({ token: 1 }, { unique: true });
export default mongoose.models.PasswordToken || mongoose.model('PasswordToken', PasswordTokenSchema);