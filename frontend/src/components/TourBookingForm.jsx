import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TourBookingForm = ({ bookings, setBookings, editingBooking, setEditingBooking }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    tourPackage: '',
    price: ''
  });
  const [error, setError] = useState(null);

  // If we're editing a booking, fill the form with existing data
  useEffect(() => {
    if (editingBooking) {
      setFormData({
        customerName: editingBooking.customerName,
        email: editingBooking.email,
        tourPackage: editingBooking.tourPackage,
        price: editingBooking.price
      });
    } else {
      setFormData({
        customerName: '',
        email: '',
        tourPackage: '',
        price: ''
      });
    }
  }, [editingBooking]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before submitting

    try {
      if (editingBooking) {
        // Update an existing booking
        const response = await axiosInstance.put(`/api/tours/${editingBooking._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setBookings(bookings.map((booking) => (booking._id === response.data._id ? response.data : booking)));
      } else {
        // Create a new tour booking
        const response = await axiosInstance.post('/api/tours', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setBookings([...bookings, response.data]);
      }

      setEditingBooking(null); // Reset editing state
      setFormData({ customerName: '', email: '', tourPackage: '', price: '' }); // Reset form
    } catch (error) {
      console.error('Error saving booking:', error.response || error.message);
      setError(error.response ? error.response.data.message : 'Failed to save booking.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingBooking ? 'Edit Tour Booking' : 'Book a Tour'}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message if it exists */}

      <input
        type="text"
        placeholder="Customer Name"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Tour Package"
        value={formData.tourPackage}
        onChange={(e) => setFormData({ ...formData, tourPackage: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBooking ? 'Update Booking' : 'Book Tour'}
      </button>
    </form>
  );
};

export default TourBookingForm;
