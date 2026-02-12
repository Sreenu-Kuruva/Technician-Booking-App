import mongoose, { Schema } from 'mongoose';

export interface IBooking {
  userId: mongoose.Types.ObjectId;
  technicianId: mongoose.Types.ObjectId;
  category: string;
  date: Date;
  timeSlot: string;
  status: 'booked' | 'cancelled';
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);