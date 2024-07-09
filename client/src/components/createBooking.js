import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from "../images/image3.jfif";
import p1 from "../images/image5.jfif";
import p2 from "../images/image6.jfif";
import p3 from "../images/image7.jfif";
import p4 from "../images/image8.jfif";
import p5 from "../images/image9.jfif";
import p6 from "../images/image10.jfif";
import p7 from "../images/image11.jfif";
import p8 from "../images/image12.jfif";
import p9 from "../images/image13.jfif";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

const BookingForm = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
  const tokenDecoded = jwtDecode(token);
  const userRole= tokenDecoded.role;
  const [Rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const carouselImages = useMemo(() => [p1, p2, p3, p4, p5, p6, p7, p8, p9], []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 5000,
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

  useEffect(() => {
    axios
      .get(`${backendUrl}/viewRoom/Rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    const selectedRoomType = booking.roomType.split("(")[0] + "";
    setPricePerHour(
      selectedRoomType === "A" ? 100 : selectedRoomType === "B" ? 80 : 50
    );

    const filteredRoomNumbers = Rooms.filter(
      (room) => room.roomType === selectedRoomType
    );

    setFilteredRooms(filteredRoomNumbers);
  }, [booking.roomType, Rooms]);

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
      url: `${backendUrl}/create`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { updatedBooking, userRole },
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <StyledContainer>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <h1 className="navbar-brand text-white">Welcome To HospitalityHub!</h1>

        

        <div className="navbar-collapse">
          <div className="navbar-nav ms-auto">
            {userRole === 'user' ? (
              <>
                <Link to="/user/bookedRooms" className="nav-link">
                  <button className="btn btn-primary mx-2">My Bookings</button>
                </Link>
                <Link to="/rooms" className="nav-link">
                  <button className="btn btn-success mx-2">All Rooms</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link">
                  <button className="btn btn-success mx-2">Admin Dashboard</button>
                </Link>
                <Link to="/view" className="nav-link">
                  <button className="btn btn-primary mx-2">All Bookings</button>
                </Link>
                <Link to="/requested" className="nav-link">
                  <button className="btn btn-success mx-2">Pending Bookings</button>
                </Link>
              </>
            )}

            <button className="btn btn-primary mx-2" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </div>

        {/* <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label> */}
      </div>
    </nav>

      <StyledContent>
        <StyledFormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
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

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Select Room Type</Form.Label>
              <StyledSelect
                name="roomType"
                className="form-control"
                value={booking.roomType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Room Type</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </StyledSelect>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Select Room Number</Form.Label>
              <StyledSelect
                name="roomNumber"
                className="form-control"
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
              </StyledSelect>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
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

            <Form.Group controlId="formBasicPassword">
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

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={priceDisplay}
                required
                disabled
              />
            </Form.Group>
            <br/>
            <Button style={{width:'20%',borderRadius:'3px',margin: 'auto', display: 'block' }}variant="primary" type="submit">
              {userRole === 'admin' ? "Add Booking" : "Request Booking"}
            </Button>
          </StyledForm>
        </StyledFormContainer>

        <StyledCarouselContainer>
          <Slider {...carouselSettings}>
            {carouselImages.map((image, index) => (
              <StyledCarouselItem key={index}>
                <img src={image} alt={`Image ${index + 1}`} />
              </StyledCarouselItem>
            ))}
          </Slider>
        </StyledCarouselContainer>
      </StyledContent>
        
        
      
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
background: linear-gradient(to right, #0052D4, #65C7F7, #9CECFB);
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
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


const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px;
`;

const StyledFormContainer = styled.div`
  width: 100%;
  max-width: 1000px; 
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;

const StyledForm = styled(Form)`
  row-gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

  .form-label {
    color: #495057;
    font-size: 1.2rem; 
  }

  .form-control {
    border: 2px solid #ced4da;
    border-radius: 8px; 
    font-size: 1rem;
  }

  ${StyledButton} {
    width: 100%;
    background-color: #007bff; 
    border-color: #007bff;
    transition: background-color 0.3s ease; 

    &:hover,
    &:focus {
      background-color: #0056b3;
    }
  }
`;

const StyledSelect = styled.select`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 5px;
  width: 100%;
`;

const StyledCarouselContainer = styled.div`
  max-width: 100%;
  margin: auto;
  margin-top: 5px;
`;

const StyledCarouselItem = styled.div`
  margin: 0 10px;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }
`;

export default BookingForm;
