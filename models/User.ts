import mongoose from 'mongoose';

export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: function (this: any) {
      // Only required for password accounts (not Google or email-code accounts)
      return !this.googleId && !this.otpUser;
    },
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: '/logo/Busundo-Icon.png'
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'superadmin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Date,
    default: null
  },
  otpUser: {
    type: Boolean,
    default: false // created by email-code sign-in, no password
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
}, {
  timestamps: true
});

// Indexes are defined in the schema fields above
export default mongoose.models.User || mongoose.model('User', UserSchema);
