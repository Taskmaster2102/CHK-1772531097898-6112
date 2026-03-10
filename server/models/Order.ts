import mongoose, { Document, Schema } from 'mongoose';

export interface ITrackingSteps {
  confirmed: boolean;
  shaping: boolean;
  firing: boolean;
  glazing: boolean;
  shipped: boolean;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  shape: 'Classic' | 'Tapered' | 'Fluted';
  size: 'S' | 'M' | 'L';
  glazeColor: string;
  engraving: string;
  price: number;
  orderDate: Date;
  status: 'In Production' | 'Shipped' | 'Delivered';
  productionStatus: 'Shaping' | 'Firing' | 'Glazing' | 'Ready';
  trackingSteps: ITrackingSteps;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrackingStepsSchema = new Schema<ITrackingSteps>(
  {
    confirmed: { type: Boolean, default: false },
    shaping: { type: Boolean, default: false },
    firing: { type: Boolean, default: false },
    glazing: { type: Boolean, default: false },
    shipped: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    shape: {
      type: String,
      enum: ['Classic', 'Tapered', 'Fluted'],
      required: true,
    },
    size: {
      type: String,
      enum: ['S', 'M', 'L'],
      required: true,
    },
    glazeColor: {
      type: String,
      required: true,
    },
    engraving: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['In Production', 'Shipped', 'Delivered'],
      default: 'In Production',
    },
    productionStatus: {
      type: String,
      enum: ['Shaping', 'Firing', 'Glazing', 'Ready'],
      default: 'Shaping',
    },
    trackingSteps: {
      type: TrackingStepsSchema,
      default: () => ({
        confirmed: true,
        shaping: false,
        firing: false,
        glazing: false,
        shipped: false,
      }),
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);

