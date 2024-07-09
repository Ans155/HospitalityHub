import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const BookingCard = ({ booking, page }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  const getDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", options);
  };

  const newPrice = booking.price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });

  const handleConfirm = (id) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${backendUrl}/create/${id}/validate`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { userRole },
    };

    axios(config)
      .then(function (response) {
        if (response.data._id !== undefined) {
          toast.success("Booking Confirmed and Confirmation email sent!");
        } else toast.error("Booking Failed");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  return (
    <StyledCard className="w-100 mb-4">
      <Card.Body>
        <div className="row">
          <div className="col-md-6">
            <CardTitle>{`Room Number: ${booking.roomNumber}`}</CardTitle>
            <CardSubtitle>{`User's Email: ${booking.userEmail}`}</CardSubtitle>
            <CardText>
              <strong>Price: </strong>
              {`${newPrice}`}
            </CardText>
          </div>
          <div className="col-md-6">
            <CardText>
              <strong>Booking Start Date: </strong>
              {`${getDate(booking.startTime)}`}
            </CardText>
            <CardText>
              <strong>Booking End Date: </strong>
              {`${getDate(booking.endTime)}`}
            </CardText>
            <CardText>
              <strong>Status: </strong>
              {`${booking.status}`}
            </CardText>
            {userRole === 'admin' && page === 'requested' ? (
              <StyledButton variant="success" onClick={() => handleConfirm(booking.bookingId)}>
                Confirm Booking
              </StyledButton>
            ) : (
              <Link to="/update" state={booking}>
                <StyledButton variant="secondary" className="mr-auto">
                  Update
                </StyledButton>
              </Link>
            )}
          </div>
        </div>
      </Card.Body>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #3494e6, #ec6ead);
  color: #fff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled(Card.Subtitle)`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const CardText = styled(Card.Text)`
  font-size: 1rem;
`;

const StyledButton = styled(Button)`
  background-color: #28a745;
  border-color: #28a745;
  margin-top: 1rem;

  &:hover,
  &:focus {
    background-color: #218838;
    border-color: #1e7e34;
  }
`;

export default BookingCard;
