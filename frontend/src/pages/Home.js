import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [tours, setTours] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/tours").then((res) => setTours(res.data));

    // Fetch user info (modify if you store differently)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleBooking = async (tourId) => {
    try {
      const token = localStorage.getItem("token"); // JWT token
      const res = await axios.post(`/api/tours/book/${tourId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      setTours(tours.map(tour => tour._id === tourId ? { ...tour, bookedBy: tour.bookedBy ? null : user._id } : tour));
    } catch (err) {
      alert("Error booking tour");
    }
  };

  return (
    <div className="container">
      <h2>Available Tours</h2>
      <div className="tour-list">
        {tours.map((tour) => (
          <div key={tour._id} className="tour-card">
            <img src={tour.image} alt={tour.name} />
            <h3>{tour.name}</h3>
            <p>{tour.description}</p>
            <p>Price: ${tour.price}</p>
            <button onClick={() => handleBooking(tour._id)}>
              {tour.bookedBy ? "Cancel Booking" : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
