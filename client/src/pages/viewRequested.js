import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const ReqBookings = () => {
  function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState({
    roomNumber: "",
    roomType: "",
    startDate: "", 
    endDate: "", 
  });
  const [filteredBookings, setFilteredBookings] = useState([]);

  const formatRefundMessage = (hours) => {
    if (hours >= 48) return "100% REFUND";
    else if (hours >= 24) return "50% REFUND";
    else return "NO REFUND";
  };

  useEffect(() => {
    axios
      .get("https://hotelbackend-4phi.onrender.com/view/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        
        setBookings(response.data.filter(booking => booking.status === 'requested'));

      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Do you want to continue delete the booking")) {
      axios
        .delete(`https://hotelbackend-4phi.onrender.com/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBookings(bookings.filter((booking) => booking.bookingId !== id));

          const refundPercentage = response.data.refundPercentage;
          const refundMessage = formatRefundMessage(refundPercentage);
          toast.info('Booking Deleted');
          
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFilterSubmit = () => {

    const formattedFilterData = {
      ...filterData,
      startDate: filterData.startDate,
      endDate: filterData.endDate,
    };

    axios
      .post("https://hotelbackend-4phi.onrender.com/filter/bookings", formattedFilterData)
      .then((response) => {
        setBookings(response.data.filter(booking => booking.status === 'requested')); 
        setShowFilterModal(false);
      })
      .catch((error) => {

        console.error("Error filtering bookings:", error);
        toast.error("Error filtering bookings");
      });
  };

  return (
    <div style={{ backgroundColor: "#ff6666", padding: "20px" , minHeight: '100vh', color: 'white' }}>
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
  <h1 style={{ margin: "0" }}>PENDING BOOKINGS</h1>
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
        All Booking
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
      LOGOUT
    </button>
  </div>
</nav>
<br/>
<br/>
<br/>
<br/>
<br/>
<Container style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Form>
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <Form.Group controlId="roomNumber">
                <Form.Label style={{color:'black'}}>Room Number</Form.Label>
                <Form.Control
                  type="text"
                  name="roomNumber"
                  value={filterData.roomNumber}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      roomNumber: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="roomType">
                <Form.Label style={{color:'black'}}>Room Type</Form.Label>
                <Form.Control
                  type="text"
                  name="roomType"
                  value={filterData.roomType}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      roomType: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label style={{color:'black'}}>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDate"
                  value={filterData.startDate}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      startDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label style={{color:'black'}}>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDate"
                  value={filterData.endDate}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      endDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleFilterSubmit}
              >
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <br></br>
      {/* Main content */}
      <Container>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: "0" }}>Booking Details</h3>
                <button
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#ffffff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(booking.bookingId)}
                >
                  Delete
                </button>
              </div>
              <BookingCard booking={booking} />
            </div>
          ))
        ) : (
          <>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: "0" }}>Booking Details</h3>
                    <button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#ffffff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(booking.bookingId)}
                    >
                      Delete
                    </button>
                  </div>
                  <BookingCard booking={booking} page={'requested'} />
                </div>
              ))
            ) : (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #f5c6cb",
                  borderRadius: "4px",
                }}
              >
                No Booking Found!
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ReqBookings;
