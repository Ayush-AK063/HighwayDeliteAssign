import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpiry: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);