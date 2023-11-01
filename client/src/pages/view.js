import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";

const Bookings = () => {
  function getDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/view/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  function notify(temp) {
    if (parseInt(temp) < 24) toast.info("Booking Deleted - NO REFUND");
    else if (parseInt(temp) < 48) toast.info("Booking Deleted - 50% REFUND");
    else toast.info("Booking Deleted - 100% REFUND");
  }

  const handleDelete = (id) => {
    if (window.confirm("Do you want to continue delete the booking")) {
      axios.delete(`http://localhost:5000/delete/${id}`).then(() => {
        setBookings(bookings.filter((booking) => booking.bookingId !== id));
      });
    }
  };

  return (
    <div>
      <h1>View Bookings</h1>
      <Container className="container">
        {console.log(bookings, bookings.length)}
        {bookings.length > 0 && (
          <>
            {bookings.map((booking) => (
              <div className="item" key={booking._id}>
                <BookingCard booking={booking} />
                <button
                  className="btn btn-danger btn1"
                  onClick={() => handleDelete(booking.bookingId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </Container>
    </div>
  );
};

export default Bookings;
