import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);

const MonthlyRevenueChart = () => {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/stats`); // Replace with your API endpoint
        const data = response.data;

        // Assuming the API returns an object with monthlyStats property
        setMonthlyStats(data.monthlyStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Extracting months, revenues, and bookings from the data for the chart
  const months = Array.from({ length: 12 }, (_, index) => index + 1); // Assuming 12 months
  const revenueMap = new Map(monthlyStats.map(item => [item._id, item.totalAmount]));
  const revenues = months.map(month => revenueMap.get(month) || 0);

  // Chart data and options
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Revenue',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: revenues,
      },
    ],
  };

  const chartOptions = {
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value',
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2 className="text-center mt-4" >Monthly Revenue Chart</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default MonthlyRevenueChart;
