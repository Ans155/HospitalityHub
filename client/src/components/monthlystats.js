// MonthlyStats.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyStats = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/stats`); // Update the API endpoint
        const data = response.data;
        setMonthlyData(data.monthlyStats);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };

    fetchMonthlyStats();
  }, []);

  // Function to fill in missing months with zero values
  const fillMissingMonths = (data) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const filledData = allMonths.map((month) => {
      const existingData = data.find((entry) => entry._id === month);
      return existingData ? existingData.totalBookings : 0;
    });
    return filledData;
  };

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i + 1), // Assuming months are represented by numbers 1 to 12
    datasets: [
      {
        label: 'Bookings',
        data: fillMissingMonths(monthlyData),
        backgroundColor: 'green',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'linear',
        stacked: true,
        ticks: {
          maxRotation: 90,
          minRotation: 0,
          autoSkip: false,
          maxTicksLimit: 12,
        },
      },
      y: {
        type: 'linear',
        ticks: {
          beginAtZero: true,
        },
        stacked: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-center mt-4">Monthy Bookings</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MonthlyStats;
