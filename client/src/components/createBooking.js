import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import image1 from "../images/image3.jfif";
import HospitalityHub from "../images/image4.jfif";

const BookingForm = () => {
  const token = localStorage.getItem('token');
  const [pricePerHour, setPricePerHour] = useState(0);
  const navigate = useNavigate();
  const [postAdded, setPostAdded] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState();
  const [booking, setBooking] = useState({
    userEmail: "",
    roomType: "",
    roomNumber: "",
    startTime: "",
    endTime: "",
    price: 0,
  });

  const [Rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  
  useEffect(() => {
    axios
      .get("https://hotelbackend-4phi.onrender.com/viewRoom/Rooms",{headers: {
        Authorization: `Bearer ${token}`,
      },})
      .then((response) => {
        setRooms(response.data);
      });
  }, []);

  useEffect(() => {
    if (booking.endTime === "" || booking.startTime === "") return;
    const milliseconds = Math.ceil(
      Math.abs(Date.parse(booking.endTime) - Date.parse(booking.startTime))
    );
    const hours = Math.ceil(milliseconds / 36e5);
    const priceDisplay = hours * pricePerHour;
    setPriceDisplay(priceDisplay);
  }, [booking, pricePerHour]);

  useEffect(() => {
    // Filter rooms based on the selected room type
    const selectedRoomType = booking.roomType.split("(")[0] + "";
    setPricePerHour(selectedRoomType === "A" ? 100 : selectedRoomType === "B" ? 80 : 50);

    const filteredRoomNumbers = Rooms.filter(
      (room) => room.roomType === selectedRoomType
    );

    setFilteredRooms(filteredRoomNumbers);
  }, [booking.roomType, Rooms]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "endTime" && Date.parse(value) <= Date.parse(booking.startTime)) {
      alert("End time must be greater than the start time");
      return; // Prevent updating endTime
    }

    setBooking({
      ...booking,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const milliseconds = Math.ceil(
      Math.abs(Date.parse(booking.endTime) - Date.parse(booking.startTime))
    );
    const hours = Math.ceil(milliseconds / 36e5);
    const price = hours * pricePerHour;
    const updatedBooking = {
      ...booking,
      roomType: booking.roomType,
      price,
    };
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://hotelbackend-4phi.onrender.com/create",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: updatedBooking,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data._id !== undefined) {
          toast.success("Booking Made and details sent to your email address!");
          setPostAdded(true);
        } else toast.error("Booking Failed");
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status === 400 && error.response.data.error === 'Overlapping booking exists') {
          toast.error("Overlapping booking exists");
        }
        toast.error(error.response.data.message);
      });
  };
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  const imageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const imageStyle = {
    width: "500px",
    height: "300px",
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
        <h1 className="text-white mx-2">Welcome To HospitalityHub!</h1>
        <Link to="/view">
          <button className="btn btn-success mx-2">View bookings</button>
        </Link>
      </nav>
      <Form className="row w-sm-100 m-3" onSubmit={handleSubmit}>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicEmail">
          <Form.Label>User Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={booking.userEmail}
            name="userEmail"
            onChange={handleInputChange}
            required
            
          />
        </Form.Group>

        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>Select Room Type</Form.Label>
          <select
            name="roomType"
            className="form-control"
            id="exampleFormControlSelect1"
            value={booking.roomType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Room Type</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </Form.Group>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>Select Room Number</Form.Label>
          <select
            name="roomNumber"
            className="form-control"
            id="exampleFormControlSelect1"
            onChange={handleInputChange}
            value={booking.roomNumber}
            required
          >
            <option value="">Select a Room Number</option>
            {filteredRooms.map((room) => (
              <option key={room.roomNumber} value={room.roomNumber}>
                {room.roomNumber}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>Start Time:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startTime"
            value={booking.startTime}
            onChange={handleInputChange}
            required
            min={getCurrentDateTime()}
          />
        </Form.Group>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>End Time:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endTime"
            value={booking.endTime}
            onChange={handleInputChange}
            min={getCurrentDateTime()}
            required
          />
        </Form.Group>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={priceDisplay}
            required
            disabled
          />
        </Form.Group>
        <Button className="col-md-3 mx-auto" variant="primary" type="submit">
          Add Booking
        </Button>
      </Form>
      <div style={imageContainerStyle}>
        <img
          src={image1}
          alt="Image 1"
          style={{ ...imageStyle, maxWidth: "100%" }}
          className="img-fluid"
        />
      </div>
    </>
  );
};

export default BookingForm;
