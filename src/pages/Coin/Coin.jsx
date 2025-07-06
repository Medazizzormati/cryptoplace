import React, { useContext, useState, useEffect } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      setError(null);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-DjbKt5E7tYVbf9AcmC7oJgF7",
        },
      };

      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch coin data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching coin data:", err);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      setError(null);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-DjbKt5E7tYVbf9AcmC7oJgF7",
        },
      };

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching historical data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setCoinData(null);
    setHistoricalData(null);
    fetchCoinData();
  }, [coinId]);

  useEffect(() => {
    if (coinData) {
      fetchHistoricalData();
    }
  }, [coinData, currency]);

  if (loading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="error-container">
        <h2>Coin Not Found</h2>
        <p>The requested cryptocurrency could not be found.</p>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image?.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol?.toUpperCase()})
          </b>
        </p>
      </div>
      
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank || 'N/A'}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.current_price?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.market_cap?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.high_24h?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.low_24h?.[currency.name]?.toLocaleString() || 'N/A'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;