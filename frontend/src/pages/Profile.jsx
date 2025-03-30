import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>You haven't booked any tours yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div key={booking._id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                <img 
                  src={`/${booking.tour.image}`}
                  alt={booking.tour.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{booking.tour.name}</h3>
                <p className="font-bold">Price: ${booking.tour.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">
                  Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;