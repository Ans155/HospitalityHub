import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookings from "./pages/view";
import BookingForm from "./components/createBooking";
import Signup from "./components/signup";
import Login from "./components/Login";
import UpdatingForm from "./pages/update";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/view" element={<Bookings />} />
          <Route path="/" element={<BookingForm />} />
          <Route path="/update" element={< UpdatingForm />} />
          <Route path="/signup" element={< Signup />} />
          <Route path="/login" element={< Login/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;