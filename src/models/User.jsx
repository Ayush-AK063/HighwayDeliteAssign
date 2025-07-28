import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpiry: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);