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
  const [error, setError] = useState(null);
  const [compareInfo, setCompareInfo] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const api_key = "A3XWHM6SB6OJN8ZN";
      const urlParams = new URLSearchParams(window.location.search);
      const start_date = urlParams.get('start_date') || '2022-01-01';
      const stock1 = urlParams.get('stock1') || 'AAPL';
      const stock2 = urlParams.get('stock2') || 'GOOGL';

      try {
        const [data1, data2] = await Promise.all([
          fetchStockTimeSeries(stock1, api_key),
          fetchStockTimeSeries(stock2, api_key)
        ]);

        const { processedData, compareInfo } = processStockData(data1, data2, start_date);
        setStockData(processedData);
        setCompareInfo(compareInfo);
      } catch (err) {
        setError('Our API provider\'s bitch ass limits us to 25 requests per day. Please try again tomorrow.');
        console.error(err);
      }
    };

    fetchStockData();
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
        text: compareInfo ? `${compareInfo.stock1}: ${compareInfo.return1.toFixed(2)}%, ${compareInfo.stock2}: ${compareInfo.return2.toFixed(2)}%` : 'Loading...',
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
      <h1>Stock Racer</h1>
      {error ? (
        <p>{error}</p>
      ) : stockData ? (
        <div style={{ width: '80%', margin: 'auto' }}>
          <Line data={stockData} options={options} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

async function fetchStockTimeSeries(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function processStockData(data1, data2, startDate) {
  const timeSeries1 = data1['Time Series (Daily)'];
  const timeSeries2 = data2['Time Series (Daily)'];

  const labels = [];
  const values1 = [];
  const values2 = [];

  Object.entries(timeSeries1).forEach(([date, values]) => {
    if (date >= startDate) {
      labels.unshift(date);
      values1.unshift(parseFloat(values['4. close']));
    }
  });

  Object.entries(timeSeries2).forEach(([date, values]) => {
    if (date >= startDate) {
      values2.unshift(parseFloat(values['4. close']));
    }
  });

  const startPrice1 = values1[0];
  const startPrice2 = values2[0];
  const endPrice1 = values1[values1.length - 1];
  const endPrice2 = values2[values2.length - 1];

  const return1 = ((endPrice1 - startPrice1) / startPrice1) * 100;
  const return2 = ((endPrice2 - startPrice2) / startPrice2) * 100;

  const compareInfo = {
    stock1: data1['Meta Data']['2. Symbol'],
    stock2: data2['Meta Data']['2. Symbol'],
    return1,
    return2
  };

  return {
    processedData: {
      labels,
      datasets: [
        {
          label: data1['Meta Data']['2. Symbol'],
          data: values1,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: data2['Meta Data']['2. Symbol'],
          data: values2,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          yAxisID: 'y1',
        }
      ]
    },
    compareInfo
  };
}

export default App;
