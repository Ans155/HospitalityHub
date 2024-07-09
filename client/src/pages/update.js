import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMemo } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import image1 from "../images/image3.jfif";
import { jwtDecode } from "jwt-decode";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import p1 from "../images/image5.jfif";
import p2 from "../images/image6.jfif";
import p3 from "../images/image7.jfif";
import p4 from "../images/image8.jfif";
import p5 from "../images/image9.jfif";
import p6 from "../images/image10.jfif";
import p7 from "../images/image11.jfif";
import p8 from "../images/image12.jfif";
import p9 from "../images/image13.jfif";
const UpdatingForm = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  const [pricePerHour, setPricePerHour] = useState(0);
  const id = useLocation().state.bookingId;
  const navigate = useNavigate();
  const [postAdded, setPostAdded] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState();
  const carouselImages = useMemo(() => [p1, p2, p3, p4, p5,p6,p7,p8,p9], []);

  const [booking, setBooking] = useState({
    userEmail: useLocation().state.userEmail,
    roomNumber: useLocation().state.roomNumber,
    roomType: useLocation().state.roomType,
    
    startTime: useLocation().state.startTime,
    endTime: useLocation().state.endTime,
    price: useLocation().state.price,
  });
  const tokenDecoded = jwtDecode(token);
  const userRole= tokenDecoded.role;
  const [Rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 10000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768, // Adjust this breakpoint as needed
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const carouselContainerStyle = {
    maxWidth: '1000px',
    margin: 'auto',
    marginTop: '20px',
  };
  const handleLogout =() => {
    console.log('loggin out')
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() =>{
    const filteredRoomNumber = Rooms.filter(
      (room) => room.roomType === booking.roomType
    );
    setFilteredRooms(filteredRoomNumber);
  },[])
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "startTime" && booking.endTime!=="") {
      if(Date.parse(value) >= Date.parse(booking.endTime))
      alert("End time must be greater than the start time");
      
      return;
    }
    if (name === "endTime" && booking.startTime==="") {
      alert("First enter start time");
      
      return;
    }
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
    axios.get(`${backendUrl}/viewRoom/Rooms`, {headers: {
      Authorization: `Bearer ${token}`,
    },}).then((response) => {
      setRooms(response.data);
    });
  }, [booking.roomType]);

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
      url: `${backendUrl}/edit/${id}`,
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
    <div style={{backgroundColor: "#add8e6", minHeight: '100vh', color: 'white' }}>

    
<nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around mb-3">
  <h1 className="text-white mx-2">Welcome To HospitalityHub!</h1>
  
  <div>
  {userRole==='user'? 
  (
  <>
  <Link to='/user/bookedRooms'>
    <button
      className="btn btn-primary mx-2"
    >
      My Bookings
    </button>
    </Link>
  
    <Link to="/rooms">
      <button className="btn btn-success mx-2">All Rooms</button>
    </Link>
    </>
)
    : 
    <>
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
    <Link to='/view'>
    <button
      className="btn btn-primary mx-2"
    >
      All Bookings
    </button>
    </Link>
  
    <Link to="/requested">
      <button className="btn btn-success mx-2">Pending Bookings</button>
    </Link>
    
    </>
}
    
  
  <button className="btn btn-primary mx-2" onClick={handleLogout}>
    LOGOUT
  </button>
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
            {filteredRooms.length>0 ? (
              <>
                {filteredRooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    {room.roomNumber}
                  </option>
                ))}
                </>
            ) : (
              <>
                {Rooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    {room.roomNumber}
                  </option>
                ))}
                </>

            )}
            
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
      
      <div style={carouselContainerStyle}>
        <Slider {...carouselSettings}>
          {carouselImages.map((image, index) => (
            <div key={index} style={{margin: '0 10px'}}>
              <img src={image} alt={`Image ${index + 1}`} style={{ width: '98%', height: '250px' }} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
    </>
  );
};

export default UpdatingForm;
