import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";


const Bookings = () => {
  function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }

  const [bookings, setBookings] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState({
    roomNumber: "",
    roomType: "",
    startDate: "",
    endDate: "", 
  });
  const formatRefundMessage = (hours) => {
    if (hours >= 48) return "100% REFUND";
    else if (hours >= 24) return "50% REFUND";
    else return "NO REFUND";
  };
  useEffect(() => {
    axios.get("https://hotelbackend-4phi.onrender.com/view/bookings").then((response) => {
      
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
      axios.delete(`https://hotelbackend-4phi.onrender.com/delete/${id}`).then((response) => {
        setBookings(bookings.filter((booking) => booking.bookingId !== id));

        const refundPercentage = response.data.refundPercentage;
        const refundMessage = formatRefundMessage(refundPercentage);
        toast.info(`Booking Deleted - ${refundMessage}`);
      });
    }
  };

  const handleFilterSubmit = () => {
    // Convert date inputs to the format used in your database
    console.log(filterData.startDate);
    const formattedFilterData = {
      ...filterData,
      startDate: filterData.startDate,
      endDate: filterData.endDate,
        
    };
    console.log(formattedFilterData.startDate);
    // Send a request to the server with the formatted filter criteria
    axios
      .post("https://hotelbackend-4phi.onrender.com/filter/bookings", formattedFilterData)
      .then((response) => {
        setBookings(response.data); 
        setShowFilterModal(false); 
      })
      .catch((error) => {
        // Handle error, e.g., display an error message or toast
        console.error("Error filtering bookings:", error);
        toast.error("Error filtering bookings");
      });
  };
  

// Function to format date for the backend
const formatDateForBackend = (dateString) => {
  if (dateString) {
    const dateTimeParts = dateString.split(' ');
    if (dateTimeParts.length === 2) {
      const [datePart, timePart] = dateTimeParts;
      const dateParts = datePart.split('-');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        const timeParts = timePart.split(':');
        if (timeParts.length === 2) {
          const [hours, minutes] = timeParts;
          const formattedDate = new Date(
            `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
          );
          return formattedDate.toISOString();
        }
      }
    }
  }

  return null;
};



  return (
    <div >
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
        <h1 className="text-white mx-2">View Bookings</h1>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary mx-2"
            onClick={() => setShowFilterModal(true)}
          >
            Filter
          </button>
          <Link to="/">
            <button className="btn btn-success mx-2">Add Booking</button>
          </Link>
        </div>
      </nav>

      <Container className="container">
        {console.log(bookings, bookings.length)}
        {bookings.length === undefined && (
  <div
    style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '10px',
      maxWidth: '100%',
      textAlign: 'center',
      margin: '0 auto',
    }}
  >
    No Booking Found!
  </div>
)}


        {bookings.length > 0 && (
          <>
            {bookings.map((booking) => (
              <div className="item" key={booking._id}>
                <BookingCard booking={booking} />
                <button
                  className="btn btn-danger btn1 mt-2 mb-4"
                  onClick={() => handleDelete(booking.bookingId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </Container>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Bookings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                value={filterData.roomNumber}
                onChange={(e) =>
                  setFilterData({ ...filterData, roomNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Room Type</Form.Label>
              <Form.Control
                type="text"
                name="roomType"
                value={filterData.roomType}
                onChange={(e) =>
                  setFilterData({ ...filterData, roomType: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDate"
                value={filterData.startDate}
                onChange={(e) =>
                  setFilterData({ ...filterData, startDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                value={filterData.endDate}
                onChange={(e) =>
                  setFilterData({ ...filterData, endDate: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFilterSubmit}>
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
};

export default Bookings;
