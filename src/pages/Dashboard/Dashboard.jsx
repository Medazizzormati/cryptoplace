import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState('24h');

  // Simulated data
  const portfolioData = {
    totalValue: 45687.32,
    change24h: 2.34,
    changePercent: 5.12,
    totalProfit: 8234.67
  };

  const topCryptos = [
    { name: 'Bitcoin', symbol: 'BTC', price: 43250, change: 2.3, amount: 0.5 },
    { name: 'Ethereum', symbol: 'ETH', price: 2650, change: -1.2, amount: 2.1 },
    { name: 'Binance Coin', symbol: 'BNB', price: 315, change: 4.8, amount: 5.0 },
    { name: 'Cardano', symbol: 'ADA', price: 0.52, change: 1.9, amount: 1000 }
  ];

  const recentTransactions = [
    { type: 'buy', crypto: 'BTC', amount: 0.1, price: 43250, time: '2 hours ago' },
    { type: 'sell', crypto: 'ETH', amount: 0.5, price: 2650, time: '1 day ago' },
    { type: 'buy', crypto: 'BNB', amount: 2.0, price: 315, time: '2 days ago' },
    { type: 'sell', crypto: 'ADA', amount: 500, price: 0.52, time: '3 days ago' }
  ];

  const quickStats = [
    { title: 'Total Portfolio', value: '$45,687', change: '+5.12%', positive: true },
    { title: 'Today\'s P&L', value: '$1,234', change: '+2.34%', positive: true },
    { title: 'Active Positions', value: '12', change: '+2', positive: true },
    { title: 'Alerts Set', value: '8', change: '+1', positive: true }
  ];

  const marketOverview = [
    { name: 'Market Cap', value: '$2.1T', change: '+1.2%', positive: true },
    { name: 'Total Volume', value: '$78.5B', change: '+5.8%', positive: true },
    { name: 'Bitcoin Dominance', value: '42.5%', change: '-0.3%', positive: false },
    { name: 'Active Coins', value: '23,456', change: '+12', positive: true }
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.username}! 👋</h1>
            <p>Here's what's happening with your crypto portfolio today</p>
          </div>
          <div className="time-selector">
            <button className={timeFrame === '24h' ? 'active' : ''} onClick={() => setTimeFrame('24h')}>24H</button>
            <button className={timeFrame === '7d' ? 'active' : ''} onClick={() => setTimeFrame('7d')}>7D</button>
            <button className={timeFrame === '30d' ? 'active' : ''} onClick={() => setTimeFrame('30d')}>30D</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <h3>{stat.title}</h3>
              <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Portfolio Overview */}
        <div className="widget portfolio-widget">
          <div className="widget-header">
            <h2>Portfolio Overview</h2>
            <div className="portfolio-value">
              <span className="value">${portfolioData.totalValue.toLocaleString()}</span>
              <span className="change positive">+{portfolioData.changePercent}%</span>
            </div>
          </div>
          <div className="portfolio-chart">
            <div className="chart-container">
              <div className="chart-line"></div>
              <div className="chart-area"></div>
              <div className="chart-points">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="chart-point" style={{
                    left: `${(i * 100) / 6}%`,
                    bottom: `${20 + Math.random() * 60}%`
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Holdings */}
        <div className="widget holdings-widget">
          <div className="widget-header">
            <h2>Top Holdings</h2>
            <Link to="/portfolio" className="view-all">View All</Link>
          </div>
          <div className="holdings-list">
            {topCryptos.map((crypto, index) => (
              <div key={index} className="holding-item">
                <div className="crypto-info">
                  <div className="crypto-icon">{crypto.symbol.charAt(0)}</div>
                  <div className="crypto-details">
                    <div className="crypto-name">{crypto.name}</div>
                    <div className="crypto-symbol">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="crypto-stats">
                  <div className="crypto-price">${crypto.price.toLocaleString()}</div>
                  <div className={`crypto-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="widget actions-widget">
          <div className="widget-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn buy-btn">
              <span className="action-icon">💰</span>
              <span>Buy Crypto</span>
            </button>
            <button className="action-btn sell-btn">
              <span className="action-icon">📈</span>
              <span>Sell Crypto</span>
            </button>
            <button className="action-btn transfer-btn">
              <span className="action-icon">🔄</span>
              <span>Transfer</span>
            </button>
            <button className="action-btn alert-btn">
              <span className="action-icon">🔔</span>
              <span>Set Alert</span>
            </button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="widget market-widget">
          <div className="widget-header">
            <h2>Market Overview</h2>
          </div>
          <div className="market-stats">
            {marketOverview.map((stat, index) => (
              <div key={index} className="market-stat">
                <div className="stat-label">{stat.name}</div>
                <div className="stat-row">
                  <div className="stat-value">{stat.value}</div>
                  <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="widget activity-widget">
          <div className="widget-header">
            <h2>Recent Activity</h2>
            <Link to="/history" className="view-all">View All</Link>
          </div>
          <div className="activity-list">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${tx.type}`}>
                  {tx.type === 'buy' ? '⬆️' : '⬇️'}
                </div>
                <div className="activity-details">
                  <div className="activity-main">
                    <span className="activity-type">{tx.type.toUpperCase()}</span>
                    <span className="activity-crypto">{tx.crypto}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-amount">{tx.amount} {tx.crypto}</span>
                    <span className="activity-time">{tx.time}</span>
                  </div>
                </div>
                <div className="activity-value">
                  ${(tx.amount * tx.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div className="widget news-widget">
          <div className="widget-header">
            <h2>Market News</h2>
            <Link to="/news" className="view-all">View All</Link>
          </div>
          <div className="news-list">
            <div className="news-item">
              <div className="news-content">
                <h4>Bitcoin Reaches New All-Time High</h4>
                <p>The leading cryptocurrency surged to unprecedented levels...</p>
                <span className="news-time">2 hours ago</span>
              </div>
            </div>
            <div className="news-item">
              <div className="news-content">
                <h4>Ethereum 2.0 Update Progress</h4>
                <p>The highly anticipated upgrade shows promising developments...</p>
                <span className="news-time">4 hours ago</span>
              </div>
            </div>
            <div className="news-item">
              <div className="news-content">
                <h4>New DeFi Protocol Launches</h4>
                <p>Revolutionary lending platform goes live on mainnet...</p>
                <span className="news-time">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 