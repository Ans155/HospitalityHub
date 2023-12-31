// Sidebar.js

import React from 'react';
import './style.css';

function Sidebar({ setPage }) {
  return (
    <div className='bg-dark text-white sidebar p-2'>
      <div className='m-2'>
        <i className='bi bi-bootstrap-fill me-2 fs-4'></i>
        <span className='text-bold brand-name fs-4'>Hospitality Hub</span>
      </div>
      <hr className='text-light' />
      <div className='list-group list-group-flush'>
        <a className='list-group-item py-2'>
          <i className='bi bi-speedometer2 fs-5 me-3'></i>
          <span onClick={() => setPage('dashboard')} className='fs-5 font-weight-bold'>Dashboard</span>
        </a>
        <a className='list-group-item py-2'>
          <i className='bi bi-house fs-4 me-3'></i>
          <span className='fs-5 font-weight-bold' onClick={() => setPage('bookings')}>Monthly Bookings</span>
        </a>
        <a className='list-group-item py-2'>
          <i className='bi bi-house fs-4 me-3'></i>
          <span className='fs-5 font-weight-bold' onClick={() => setPage('revenue')}>Monthly Revenue</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
