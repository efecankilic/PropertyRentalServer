const express = require('express');
const router = express.Router();
const Booking = require('../models/BookingModel');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('property');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;
    console.log({
      property: propertyId,
      user: req.user.id,
      startDate,
      endDate,
    })
    const booking = new Booking({
      property: propertyId,
      user: req.user.id,
      startDate,
      endDate,
    });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    await Booking.deleteOne({ _id: req.params.id });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
