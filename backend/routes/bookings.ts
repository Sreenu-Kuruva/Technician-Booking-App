import express from 'express';
import Booking from '../models/Booking';
import Notification from '../models/Notification';
import User from '../models/User';

const router = express.Router();

const timeSlots = ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'];

router.get('/technicians', async (req, res) => {
  const { category, date } = req.query;
  const technicians = await User.find({ role: 'technician', category });
  const available = await Promise.all(technicians.map(async (tech) => {
    const slots = await Promise.all(timeSlots.map(async (slot) => {
      const booked = await Booking.findOne({ technicianId: tech._id, date: new Date(date as string), timeSlot: slot, status: 'booked' });
      return { slot, available: !booked };
    }));
    return { ...tech.toObject(), slots };
  }));
  res.json(available);
});

router.post('/book', async (req, res) => {
  const { userId, technicianId, category, date, timeSlot } = req.body;
  const existing = await Booking.findOne({ technicianId, date: new Date(date), timeSlot, status: 'booked' });
  if (existing) return res.status(400).json({ error: 'Slot taken' });
  const booking = new Booking({ userId, technicianId, category, date: new Date(date), timeSlot });
  await booking.save();
  const notification = new Notification({ userId: technicianId, message: `New booking on ${date} at ${timeSlot}` });
  await notification.save();
  res.json(booking);
});

router.put('/cancel/:id', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  const notification = new Notification({ userId: booking.technicianId, message: `Booking cancelled on ${booking.date} at ${booking.timeSlot}` });
  await notification.save();
  res.json(booking);
});

router.get('/technician/:id', async (req, res) => {
  const bookings = await Booking.find({ technicianId: req.params.id, status: 'booked' }).populate('userId', 'username email');
  res.json(bookings);
});

router.get('/notifications/:userId', async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.userId });
  res.json(notifications);
});

router.put('/notifications/:id/read', async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(notification);
});

export default router;