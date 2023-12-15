import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import image1 from "../images/image3.jfif";

const UpdatingForm = () => {
  const token = localStorage.getItem('token');
  const [pricePerHour, setPricePerHour] = useState(0);
  const id = useLocation().state.bookingId;
  const navigate = useNavigate();
  const [postAdded, setPostAdded] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState();
  const [booking, setBooking] = useState({
    userEmail: useLocation().state.userEmail,
    roomType: useLocation().state.roomType,
    roomNumber: useLocation().state.roomNumber,
    startTime: useLocation().state.startTime,
    endTime: useLocation().state.endTime,
    price: useLocation().state.price,
  });

  const [Rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "endTime" && Date.parse(value) <= Date.parse(booking.startTime)) {
      alert("End time must be greater than the start time");
      return;
    }

    setBooking({
      ...booking,
      [name]: value,
    });

    if (name === "roomType") {
      const selectedRoomType = value.split("(")[0] + "";
      setPricePerHour(
        selectedRoomType === "A" ? 100 : selectedRoomType === "B" ? 80 : 50
      );

      const filteredRoomNumbers = Rooms.filter(
        (room) => room.roomType === selectedRoomType
      );

      setFilteredRooms(filteredRoomNumbers);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/viewRoom/Rooms", {headers: {
      Authorization: `Bearer ${token}`,
    },}).then((response) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const milliseconds = Math.ceil(
      Math.abs(Date.parse(booking.endTime) - Date.parse(booking.startTime))
    );
    const hours = Math.ceil(milliseconds / 36e5);
    const price = hours * pricePerHour;
    const updatedBooking = { ...booking, price };

    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/edit/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: updatedBooking,
    };

    axios(config)
      .then(function (response) {
        if (response.data._id !== undefined) {
          toast.success("Booking Updated");
          setPostAdded(true);
        } else {
          toast.error("Booking Failed");
        }
      })
      .catch(function (error) {
        if (error.response.status === 400 && error.response.data.error === 'Overlapping booking exists') {
          toast.error("Overlapping booking exists");
        }
        toast.error(error.response.data.message);
      });
  };

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
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
        <h1 className="text-white mx-2">Let's upgrade your booking details!</h1>
        <div>
          <Link to="/view">
            <button className="btn btn-success mx-2">View bookings</button>
          </Link>
          <Link to="/">
            <button className="btn btn-primary mx-2">Add Booking</button>
          </Link>
        </div>
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

        <Form.Group
          className="col-12 col-md-6 mb-3"
          controlId="formBasicPassword"
        >
          <Form.Label>Select Room Type</Form.Label>
          <select
            name="roomType"
            class="form-control"
            id="exampleFormControlSelect1"
            value={booking.roomType}
            onChange={handleInputChange}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </Form.Group>
        <Form.Group
          className="col-12 col-md-6 mb-3"
          controlId="formBasicPassword"
        >
          <Form.Label>Select Room Number</Form.Label>
          <select
            name="roomNumber"
            className="form-control"
            id="exampleFormControlSelect1"
            onChange={handleInputChange}
            value={booking.roomNumber}
          >
            <option>Select a Room Number</option>
            {filteredRooms.map((room) => (
              <option key={room.roomNumber} value={room.roomNumber}>
                {room.roomNumber}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group
          className="col-12 col-md-6 mb-3"
          controlId="formBasicPassword"
        >
          <Form.Label>Start Time:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startTime"
            value={booking.startTime}
            onChange={handleInputChange}
            min={getCurrentDateTime()}
            required
          />
        </Form.Group>
        <Form.Group
          className="col-12 col-md-6 mb-3"
          controlId="formBasicPassword"
        >
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
        <Form.Group
          className="col-12 col-md-6 mb-3"
          controlId="formBasicPassword"
        >
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
          Update Booking
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

export default UpdatingForm;
