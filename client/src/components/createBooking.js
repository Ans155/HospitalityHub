import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BookingForm = () => {
  // const roomNumber = 101;
  // const pricePerHour = 100;
  const [pricePerHour, setPricePerHour] = useState(50);
  // const [roomNumber,setRoomNumber] = useState("");
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
  const [cpy, setCpy] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   console.log(name, value);
  //   setBooking({
  //     ...booking,
  //     [name]: value,
  //   });
  //   if (name === "roomType") {
  //     // Filter rooms based on the selected room type
  //     const selectedRoomType = value.split("(")[0] + "";
  //     setPricePerHour(
  //       selectedRoomType === "A" ? 100 : selectedRoomType === "B" ? 80 : 50
  //     );
  //     console.log(selectedRoomType, pricePerHour);
  //     setCpy(Rooms);

  //     const filteredRoomNumbers = cpy.filter(
  //       (room) => room.roomType === selectedRoomType
  //     );
  //     // const filteredRoomNumbers = Rooms
  //     //   .filter(room => room.type === selectedRoomType);
  //     // Update the available room numbers in the dropdown
  //     setFilteredRooms(filteredRoomNumbers);
  //     // console.log(filteredRooms,Rooms);
  //   }
  // };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
  
    if (name === "endTime" && Date.parse(value) <= Date.parse(booking.startTime)) {
      alert("End time must be greater than the start time");
      return; // Prevent updating endTime
    }
  
    setBooking({
      ...booking,
      [name]: value,
    });
  
    if (name === "roomType") {
      // Filter rooms based on the selected room type
      const selectedRoomType = value.split("(")[0] + "";
      setPricePerHour(
        selectedRoomType === "A" ? 100 : selectedRoomType === "B" ? 80 : 50
      );
      console.log(selectedRoomType, pricePerHour);
      setCpy(Rooms);
  
      const filteredRoomNumbers = cpy.filter(
        (room) => room.roomType === selectedRoomType
      );
  
      // Update the available room numbers in the dropdown
      setFilteredRooms(filteredRoomNumbers);
    }
  };
  
  useEffect(() => {
    axios.get("http://localhost:5000/viewRoom/Rooms").then((response) => {
      setRooms(response.data);
      setFilteredRooms(response.data);
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
    //const updatedBooking = { ...booking, price };
    const updatedBooking = {
      ...booking,
      roomType: booking.roomType, // Make sure roomType is included
      price,
    };
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: updatedBooking,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data._id !== undefined) {
          toast.success("Booking Made");
          setPostAdded(true);
        } else toast.error("Booking Failed");
      })
      .catch(function (error) {
        console.log(error);
        alert("Overlapping booking exist!")
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
        <h1 className="text-white mx-2">Let's book some rooms!</h1>
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
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
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
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>Start Time:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startTime"
            value={booking.startTime}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="col-12 col-md-6 mb-3" controlId="formBasicPassword">
          <Form.Label>End Time:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endTime"
            value={booking.endTime}
            onChange={handleInputChange}
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
    </>
  );
};

export default BookingForm;
