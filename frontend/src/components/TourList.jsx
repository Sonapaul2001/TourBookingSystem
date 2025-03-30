import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TourList = ({ tours, setTours }) => {
  const { user } = useAuth();

  const handleCancelBooking = async (tourId) => {
    try {
      // Make a DELETE request to cancel the booking
      await axiosInstance.delete(`/api/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${user.token}` }, // Add token for authorization
      });
      
      // Update the tours state by removing the canceled tour
      setTours(tours.filter((tour) => tour._id !== tourId));
    } catch (error) {
      // Handle any errors that occur during the request
      alert('Failed to cancel the tour.');
    }
  };

  return (
    <div>
      {tours.map((tour) => (
        <div key={tour._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{tour.destination}</h2>
          <p>Date: {tour.date}</p>
          <p>Price: ${tour.price}</p>
          <p className="text-sm text-gray-500">Status: {tour.status}</p>
          <div className="mt-2">
            {tour.status === 'Booked' && (
              <button
                onClick={() => handleCancelBooking(tour._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourList;

