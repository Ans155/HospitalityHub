import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MyBookings = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
    axios
      .get(`${backendUrl}/user/${userEmail}/bookedRooms`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <StyledContainer>
      <StyledNavbar>
        <h1>HospitalityHub!</h1>
        <div>
          <Link to="/create">
            <StyledButton className="btn btn-success">Add Booking</StyledButton>
          </Link>
          <Link to="/rooms">
            <StyledButton className="btn btn-success">All Rooms</StyledButton>
          </Link>
          <StyledButton className="btn btn-primary" onClick={handleLogout}>
            LOGOUT
          </StyledButton>
        </div>
      </StyledNavbar>
      <StyledContent>
        <StyledHeading>My Bookings</StyledHeading>
        <StyledCardContainer>
          {bookings.map((booking) => (
            <StyledCard key={booking._id}>
              <div>
                <StyledCardTitle>Room Number: {booking.roomNumber}</StyledCardTitle>
                <StyledCardText>Room Type: {booking.roomType}</StyledCardText>
                <StyledCardText>Start Time: {getDate(booking.startTime)}</StyledCardText>
                <StyledCardText>End Time: {getDate(booking.endTime)}</StyledCardText>
                <StyledCardText>Price: {booking.price} rupees</StyledCardText>
              </div>
            </StyledCard>
          ))}
        </StyledCardContainer>
      </StyledContent>
    </StyledContainer>
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
      margin-right: 0.3rem
    }

    button:first-child {
      margin-left: 0;
    }
  }
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;

const StyledContent = styled.div`
  padding: 2rem;
`;

const StyledHeading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledCard = styled.div`
  background: linear-gradient(to right, #007BFF, #ffc107);
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

const StyledCardTitle = styled.h5`
  color: white;
`;

const StyledCardText = styled.p`
  margin: 0.5rem 0;
`;

export default MyBookings;
