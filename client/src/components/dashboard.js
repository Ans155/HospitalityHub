import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MonthlyStats from './monthlystats';
import MonthlyRevenueChart from './monthlyrevenue';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token=localStorage.getItem('token');
  const tokenDecoded = jwtDecode(token);
  const userRole= tokenDecoded.role;
  const [totalUsers, setTotalUsers] = useState('Loading...');
  const [totalBookings, setTotalBookings] = useState('Loading...');
  const [totalRevenue, setTotalRevenue] = useState('Loading...');
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [page,setPage] =useState('dashboard')

  useEffect(() =>{
    if(userRole==='user')
    {
      console.log(userRole)
      toast.error('require admin access!')
      navigate('/login')
    }
  },[userRole]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/stats`);
        const data = response.data;
        setTotalUsers(data.totalUsers);
        setTotalBookings(data.totalBookings);
        setTotalRevenue(data.totalRevenue);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{backgroundColor:'blue',minHeight: '100vh', width:'100%'}}>
    <div>
      {/* Navbar */}
      <nav className={`navbar navbar-dark ${toggle ? 'shifted-navbar' : ''}`}>
        <div className="container-fluid col">
          
           <div className='row-md-6'>
           <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
           </div>
            
           
          
          <div>
          <div className={`navbar-collapse ${toggle ? 'show' : ''}`} >
            <div className={`navbar-nav d-flex ms-auto flex-row`}>
              <Link to="/create" className={`nav-link btn btn-success me-2 ${toggle ? 'mb-2 rounded' : ''} text-white`}>
                Add Bookings
              </Link>
              <Link to="/requested" className={`nav-link btn btn-success me-2 ${toggle ? 'mb-2 rounded' : ''} text-white`}>
                Pending Bookings
              </Link>
              <Link to="/view" className={`nav-link btn btn-success me-2 ${toggle ? 'mb-2 rounded' : ''} text-white`}>
                All Bookings
              </Link>
              <Link to="/rooms" className={`nav-link btn btn-success me-2 ${toggle ? 'mb-2 rounded' : ''} text-white`}>
                All Rooms
              </Link>
              <button className={`nav-link btn btn-primary ${toggle ? 'mb-2 rounded' : 'me-2'} text-white`} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          </div>
          
          </div>
          
        
      </nav>
      <div className="row">
        {/* Sidebar */}
        {toggle && (
          <div className="col-2 vh-100">
            <Sidebar setPage={setPage}/>
          </div>
        )}

        {/* Content */}
        <div className={`col p-4 bg-primary ${toggle ? 'shifted' : ''}`}>
          {page==='dashboard' &&(<div className="row mt-4">
            {/* Monthly Stats */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <MonthlyStats />
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="col-md-6 mb-4">
              <div className="card" >
                <div className="card-body" >
                  <MonthlyRevenueChart />
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="col-md-4">
              <div
                className="card"
                onClick={() => navigate('/total-users')}
                style={{
                  background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
                  color: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text">{totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="col-md-4">
              <div
                className="card"
                onClick={() => navigate('/total-bookings')}
                style={{
                  background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
                  color: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Bookings</h5>
                  <p className="card-text">{totalBookings}</p>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="col-md-4">
              <div
                className="card"
                onClick={() => navigate('/total-revenue')}
                style={{
                  background: 'linear-gradient(135deg, #ffd452, #544a7d)',
                  color: '#000000',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">{totalRevenue}</p>
                </div>
              </div>
            </div>
          </div>)}
          {page==='bookings' && (
            <div>
            <div className="card">
              <div className="card-body">
                <MonthlyStats />
              </div>
            </div>
          </div>
          )}
          {page==='revenue' && (
            <div>
            <div className="card" style={{borderRadius:'50px'}}>
                <div className="card-body">
                  <MonthlyRevenueChart />
                </div>
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
