const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  tourPackage: { type: String, required: true },
  price: { type: Number, required: true }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
