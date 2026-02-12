import mongoose, { Schema } from 'mongoose';

export interface INotification {
  userId: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);