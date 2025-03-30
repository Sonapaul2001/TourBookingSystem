const Tour = require('../models/Tour');

// Book a Tour
const bookTour = async (req, res) => {
  const { customerName, email, tourPackage, price } = req.body;

  try {
    const existingBooking = await Tour.findOne({ email, tourPackage });
    if (existingBooking) {
      return res.status(400).json({ message: 'Tour already booked for this customer' });
    }

    const booking = new Tour({ customerName, email, tourPackage, price });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Tour Booking
const updateTour = async (req, res) => {
  const { customerName, email, tourPackage, price } = req.body;

  try {
    const booking = await Tour.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.customerName = customerName || booking.customerName;
    booking.email = email || booking.email;
    booking.tourPackage = tourPackage || booking.tourPackage;
    booking.price = price || booking.price;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Tour Booking
const cancelTour = async (req, res) => {
  try {
    const booking = await Tour.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.remove();
    res.json({ message: 'Tour booking canceled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tour Bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Tour.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Specific Booking
const getBooking = async (req, res) => {
  try {
    const booking = await Tour.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookTour,
  updateTour,
  cancelTour,
  getBookings,
  getBooking
};
