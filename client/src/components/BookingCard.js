import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

function BookingCard({ booking, page }) {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  function getDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", options);
  }

  const newPrice = booking.price.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });

  const handleConfirm = (id) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://hotelbackend-4phi.onrender.com/create/${id}/validate`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data._id !== undefined) {
          toast.success("Booking Confirmed and Confirmation email sent!");
        } else toast.error("Booking Failed");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  return (
    <Card className="w-100 mb-4">
      <Card.Body>
        <div className="row">
          <div className="col-md-6">
            <Card.Title>{`Room Number: ${booking.roomNumber}`}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {`User's Email: ${booking.userEmail}`}
            </Card.Subtitle>
            <Card.Text>
              <strong>Price: </strong>
              {`${newPrice}`}
            </Card.Text>
          </div>
          <div className="col-md-6">
            <Card.Text>
              <strong>Booking Start Date: </strong>
              {`${getDate(booking.startTime)}`}
            </Card.Text>
            <Card.Text>
              <strong>Booking End Date: </strong>
              {`${getDate(booking.endTime)}`}
            </Card.Text>
            <Card.Text>
              <strong>Status: </strong>
              {`${booking.status}`}
            </Card.Text>
            {userRole === 'admin' && page === 'requested' ? (
              <Button variant="success" onClick={() => handleConfirm(booking.bookingId)}>
                Confirm Booking
              </Button>
            ) : (
              <Link to="/update" state={booking}>
                <Button variant="secondary" className="mr-auto">
                  Update
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookingCard;
