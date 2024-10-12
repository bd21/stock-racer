import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    // Simulating API call with dummy data
    const dummyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'AAPL',
          data: [100, 110, 300, 165, 170, 190],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: 'GOOGL',
          data: [2800, 2850, 2900, 2950, 3000, 3050],
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          yAxisID: 'y1',
        }
      ]
    };

    setStockData(dummyData);
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'AAPL vs GOOGL Stock Prices',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'AAPL Price ($)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'GOOGL Price ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="App">
      <h1>Stock Price Comparison</h1>
      {stockData ? (
        <div style={{ width: '80%', margin: 'auto' }}>
          <Line data={stockData} options={options} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
