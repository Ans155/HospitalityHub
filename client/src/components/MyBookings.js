// MyBookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const MyBookings = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const decodedToken = jwtDecode(token);
  const userEmail = decodedToken.email;

  function getDate(date) {
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', options);
  }

  useEffect(() => {
    // Fetch user's bookings from the server
    axios
      .get(`https://hotelbackend-4phi.onrender.com/user/${userEmail}/bookedRooms`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);
  const handleLogout =() => {
    console.log('loggin out')
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
        <h1 className="text-white mx-2">HospitalityHub!</h1>
        
        <div>
        <Link to="/create">
            <button className="btn btn-success mx-2">Add Booking</button>
          </Link>
          {/* <Link to='/user/bookedRooms'>
          <button
            className="btn btn-primary mx-2"
          >
            My Bookings
          </button>
          </Link> */}
        
          <Link to="/rooms">
            <button className="btn btn-success mx-2">All Rooms</button>
          </Link>
        
        <button className="btn btn-primary mx-2" onClick={handleLogout}>
          LOGOUT
        </button>
         </div>
      </nav>
    <div className="container mt-5">
      <h2 className="mb-4 text-center">My Bookings</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">Room Number: {booking.roomNumber}</h5>
                <p className="card-text">Room Type: {booking.roomType}</p>
                <p className="card-text">Start Time: {getDate(booking.startTime)}</p>
                <p className="card-text">End Time: {getDate(booking.endTime)}</p>
                <p className="card-text">Price: {booking.price} rupees</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default MyBookings;
