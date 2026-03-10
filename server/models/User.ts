import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller'],
      default: 'buyer',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (in production, use bcrypt)
UserSchema.pre('save', async function (next) {
  // In production: this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model<IUser>('User', UserSchema);

