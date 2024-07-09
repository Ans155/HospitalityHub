import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jwtDecode } from "jwt-decode";
const RoomList = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filter, setFilter] = useState('');
  const token = localStorage.getItem('token');
  const tokenDecoded = jwtDecode(token);
  const userRole= tokenDecoded.role;
  useEffect(() => {
    axios.get(`${backendUrl}/viewRoom/Rooms`)
      .then(response => {
        setRooms(response.data);
        setFilteredRooms(response.data);
      })
      .catch(error => {
        //console.error('Error fetching rooms:', error);
      });
  }, []);

  useEffect(() => {
    if (filter) {
      const filtered = rooms.filter(room => room.roomType.toLowerCase() === filter.toLowerCase());
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [filter, rooms]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <StyledContainer>
        <nav
  style={{
    position: "fixed", 
    top: "0",
    left: "0", 
    right: "0", 
    backgroundColor: "#343a40",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    flexDirection: "column",
    alignItems: "center", 
    zIndex: "1000", 
  }}
>
  <h1 style={{ margin: "0" }}>VIEW BOOKINGS</h1>
  <div style={{ display: "flex", marginTop: "10px" }}>
  <Link to="/dashboard">
      <button
        style={{
          backgroundColor: "#28a745",
          color: "#ffffff",
          margin: "0 5px",
          border: "none",
          borderRadius: '10px',
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Admin Dashboard
      </button>
    </Link>
    <Link to="/create">
      <button
        style={{
          backgroundColor: "#28a745",
          color: "#ffffff",
          margin: "0 5px",
          border: "none",
          borderRadius: '10px',
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Add Booking
      </button>
    </Link>
    <Link to="/requested">
      <button
        style={{
          backgroundColor: "#28a745",
          color: "#ffffff",
          margin: "0 5px",
          border: "none",
          borderRadius: '10px',
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Pending Booking
      </button>
    </Link>
    <Link to="/view">
      <button
        style={{
          backgroundColor: "#28a745",
          color: "#ffffff",
          margin: "0 5px",
          border: "none",
          borderRadius: '10px',
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        All Bookings
      </button>
    </Link>
    <button
      style={{
        backgroundColor: "#007bff",
        color: "#ffffff",
        margin: "0 5px",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: '10px',
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</nav>
<br/>
<br/>
<br/>
<br/>
<br/>
        <StyledContent>
          <h2>Room List</h2>
          <StyledFilter>
            <label htmlFor="roomFilter">Filter by Room Type:</label>
            <input
              type="text"
              id="roomFilter"
              className="form-control"
              placeholder="Enter room type"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </StyledFilter>
          <StyledRoomList>
            {filteredRooms.map((room, index) => (
              <StyledCard key={room._id} even={index % 2 === 0}>
                <div>
                  <h5>Room Number: {room.roomNumber}</h5>
                  <p>Room Type: {room.roomType}</p>
                  <p>Hourly Rate: ${room.hourlyRate}</p>
                </div>
              </StyledCard>
            ))}
          </StyledRoomList>
        </StyledContent>
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.div`
  background: linear-gradient(to right, #4b6cb7, #182848);
  min-height: 100vh;
  color: white;
`;

const StyledNavbar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #343a40;
  padding: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;

    h1 {
      margin-right: auto;
    }

    div {
      display: flex;
      align-items: center;
    }

    button {
      margin-left: 0.3rem;
    }

    button:first-child {
      margin-left: 0;
    }
  }
`;

const StyledButton = styled.button`
  margin: 0 0.5rem;
`;

const StyledContent = styled.div`
  padding: 2rem;
`;

const StyledFilter = styled.div`
  margin-bottom: 1rem;
  label {
    margin-right: 1rem;
  }
`;

const StyledRoomList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledCard = styled.div`
  background: ${({ even }) => (even ? 'linear-gradient(to right, #4b6cb7, #182848)' : 'linear-gradient(to right, #ff8008, #ffc837)')};
  border: none;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  flex: 1 0 30%;
  min-width: 300px;

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.3s ease-in-out;
  }
`;

export default RoomList;
