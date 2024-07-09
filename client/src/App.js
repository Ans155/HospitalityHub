// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bookings from './pages/view';
import BookingForm from './components/createBooking';
import Signup from './components/signup';
import Login from './components/Login';
import UpdatingForm from './pages/update';
import RoomList from './components/viewRoom';
import ReqBookings from './pages/viewRequested';
import MyBookings from './components/MyBookings';
import Dashboard from './components/dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/view" element={<Bookings />} />
          <Route path="/requested" element={<ReqBookings />} />
          <Route path="/create" element={<BookingForm />} />
          <Route path="/update" element={<UpdatingForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/bookedRooms" element={<MyBookings />} />
          <Route index element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
