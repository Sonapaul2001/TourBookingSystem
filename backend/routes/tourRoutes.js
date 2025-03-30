// In your backend routes (likely in routes/bookings.js or similar)

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Book a tour
router.post('/', auth, async (req, res) => {
  try {
    const { tourId } = req.body;
    
    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      tour: tourId
    });
    
    if (existingBooking) {
      return res.status(400).json({ msg: 'Tour already booked' });
    }

    const booking = new Booking({
      user: req.user.id,
      tour: tourId,
      bookedAt: new Date()
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Cancel a booking
router.delete('/:tourId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      user: req.user.id,
      tour: req.params.tourId
    });

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's bookings
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('tour', 'name image price');
      
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

