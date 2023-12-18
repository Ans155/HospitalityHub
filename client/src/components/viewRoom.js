import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const RoomList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filter, setFilter] = useState('');
  const token = localStorage.getItem('token');


  useEffect(() => {
    // Fetch the rooms from the server
    axios.get('https://hotelbackend-4phi.onrender.com/viewRoom/Rooms')
      .then(response => {
        setRooms(response.data);
        setFilteredRooms(response.data); // Initialize filteredRooms with all rooms
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []); // Empty dependency array means this effect will run once after the initial render

  useEffect(() => {
    // Apply filter when filter state changes
    if (filter) {
      const filtered = rooms.filter(room => room.roomType.toLowerCase() === filter.toLowerCase());
      setFilteredRooms(filtered);
    } else {
      // If filter is empty, show all rooms
      setFilteredRooms(rooms);
    }
  }, [filter, rooms]);
  const handleLogout =() => {
    console.log('loggin out')
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
        <h1 className="text-white mx-2">Welcome To HospitalityHub!</h1>
        
        <div>
        <Link to="/create">
            <button className="btn btn-success mx-2">Add Booking</button>
          </Link>
          <Link to='/user/bookedRooms'>
          <button
            className="btn btn-primary mx-2"
          >
            My Bookings
          </button>
          </Link>
        
        <button className="btn btn-primary mx-2" onClick={handleLogout}>
          LOGOUT
        </button>
         </div>
      </nav>
    <div className="container mt-5">
      <h2 className="mb-4">Room List</h2>
      <div className="mb-3">
        <label htmlFor="roomFilter" className="form-label">Filter by Room Type:</label>
        <input
          type="text"
          id="roomFilter"
          className="form-control"
          placeholder="Enter room type"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredRooms.map((room, index) => (
          <div key={room._id} className="col-md-4 mb-4">
            <div className={`card ${index % 2 === 0 ? 'bg-primary' : 'bg-warning'}`} style={{ border: 'none', borderRadius: '10px', color: '#fff' }}>
              <div className="card-body">
                <h5 className="card-title">Room Number: {room.roomNumber}</h5>
                <p className="card-text">Room Type: {room.roomType}</p>
                <p className="card-text">Hourly Rate: ${room.hourlyRate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default RoomList;
