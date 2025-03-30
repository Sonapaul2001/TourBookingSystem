import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Tours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookedTours, setBookedTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axiosInstance.get('/api/tours', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTours(response.data);
        setLoading(false);
      } catch (error) {
        setError('');
        setLoading(false);
      }
    };

    fetchTours();
  }, [user]);

  const sampleTours = [
    {
      id: 1,
      name: "Antarctica",
      description: "Explore the frozen continent's majestic landscapes",
      price: 5000,
      image: "antartica.png"
    },
    {
      id: 2,
      name: "Spain",
      description: "Experience vibrant culture and delicious cuisine",
      price: 2000,
      image: "spain.png"
    },
    {
      id: 3,
      name: "Japan",
      description: "Immerse in ancient traditions and modern wonders",
      price: 1500,
      image: "japan.png"
    },
    {
      id: 4,
      name: "New York",
      description: "Discover the city that never sleeps",
      price: 2500,
      image: "new%20york.png"
    },
    {
      id: 5,
      name: "Singapore",
      description: "Garden city with futuristic architecture",
      price: 2000,
      image: "singapore.png"
    },
    {
      id: 6,
      name: "Switzerland",
      description: "Alpine beauty and charming cities",
      price: 2500,
      image: "switzerland.png"
    },
  ];

  const handleBookNow = (tourId) => {
    const isBooked = bookedTours.includes(tourId);
    
    if (isBooked) {
      setBookedTours(bookedTours.filter(id => id !== tourId));
      setBookingStatus('cancelled');
    } else {
      setBookedTours([...bookedTours, tourId]);
      setBookingStatus('booked');
    }

    setTimeout(() => setBookingStatus(null), 3000);
  };

  return (
    <div className="container mx-auto p-6 relative">
      {/* Booking Status Popup */}
      {bookingStatus && (
        <div className={`fixed top-4 right-4 text-white px-6 py-3 rounded-md shadow-lg z-50 ${
          bookingStatus === 'booked' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {bookingStatus === 'booked' 
            ? 'You have booked successfully!' 
            : 'Booking cancelled!'}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Tour Booking Open</h1>
      <p className="mb-8">Welcome to our Tour Booking website.</p>
      <p className="mb-8">Here are the tour packages available.</p>
      
      {loading && <p>Loading tours...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTours.map((tour) => {
          const isBooked = bookedTours.includes(tour.id);
          
          return (
            <div key={tour.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                <img 
                  src={`/${tour.image}`}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
                {tour.description && <p className="text-gray-600 mb-2">{tour.description}</p>}
                <p className="font-bold">Price: ${tour.price.toLocaleString()}</p>
                <button 
                  onClick={() => handleBookNow(tour.id)}
                  className={`mt-4 w-full text-white px-4 py-2 rounded transition-colors ${
                    isBooked ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isBooked ? 'Cancel Booking' : 'Book Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tours;