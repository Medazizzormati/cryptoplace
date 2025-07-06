import React, { useState } from 'react';
import './Features.css';

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { number: '500K+', label: 'Active Users' },
    { number: '200+', label: 'Cryptocurrencies' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  const mainFeatures = [
    {
      icon: '🔥',
      title: 'Advanced Trading Engine',
      description: 'Lightning-fast execution with institutional-grade infrastructure supporting millions of transactions per second.',
      details: ['Sub-millisecond latency', 'Smart order routing', 'Advanced order types', 'Risk management tools']
    },
    {
      icon: '🛡️',
      title: 'Bank-Grade Security',
      description: 'Multi-layered security protocols protecting your assets with the highest industry standards.',
      details: ['Cold storage (98%)', 'Multi-signature wallets', 'Insurance protection', 'Regular audits']
    },
    {
      icon: '📊',
      title: 'Professional Analytics',
      description: 'Comprehensive market analysis tools and real-time insights for informed trading decisions.',
      details: ['Technical indicators', 'Market depth charts', 'Price alerts', 'Portfolio analytics']
    }
  ];

  const tabFeatures = [
    {
      title: 'Trading Tools',
      features: [
        { name: 'Spot Trading', description: 'Buy and sell cryptocurrencies at current market prices' },
        { name: 'Margin Trading', description: 'Amplify your trading power with leverage up to 10x' },
        { name: 'Futures Trading', description: 'Trade cryptocurrency derivatives and hedge positions' },
        { name: 'Options Trading', description: 'Advanced options strategies for experienced traders' }
      ]
    },
    {
      title: 'Security Features',
      features: [
        { name: 'Two-Factor Authentication', description: 'Secure your account with multiple verification methods' },
        { name: 'Biometric Login', description: 'Use fingerprint or face recognition for quick access' },
        { name: 'Withdrawal Whitelist', description: 'Restrict withdrawals to pre-approved addresses only' },
        { name: 'Anti-Phishing Code', description: 'Verify authentic communications from Cryptoplace' }
      ]
    },
    {
      title: 'API & Integration',
      features: [
        { name: 'REST API', description: 'Complete programmatic access to all trading functions' },
        { name: 'WebSocket Feeds', description: 'Real-time market data streaming' },
        { name: 'FIX Protocol', description: 'Institutional-grade trading connectivity' },
        { name: 'Third-party Tools', description: 'Integrate with TradingView, Coinigy, and more' }
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Professional Trader',
      comment: 'The advanced analytics and lightning-fast execution make Cryptoplace my go-to platform for serious trading.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Portfolio Manager',
      comment: 'Outstanding security features and customer support. I trust Cryptoplace with my institutional trades.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Crypto Enthusiast',
      comment: 'Perfect for beginners and pros alike. The interface is intuitive yet powerful.',
      rating: 5
    }
  ];

  const comparison = [
    { feature: 'Trading Fees', us: '0.1%', competitors: '0.25%' },
    { feature: 'Supported Coins', us: '200+', competitors: '100+' },
    { feature: 'Security Rating', us: 'A+', competitors: 'B+' },
    { feature: 'Customer Support', us: '24/7', competitors: 'Business Hours' }
  ];

  return (
    <div className="features-container">
      {/* Hero Section */}
      <div className="features-hero">
        <div className="hero-content">
          <h1>Platform Features</h1>
          <p>Experience the most advanced cryptocurrency trading platform with institutional-grade tools and unmatched security</p>
          <div className="hero-buttons">
            <button className="primary-btn">Start Trading</button>
            <button className="secondary-btn">View Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="chart-preview">
              <div className="chart-line"></div>
              <div className="chart-bars">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '45%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Features */}
      <div className="main-features">
        <h2>Why Choose Cryptoplace</h2>
        <div className="features-grid">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-details">
                {feature.details.map((detail, idx) => (
                  <li key={idx}>✓ {detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tabbed Features */}
      <div className="tabbed-features">
        <h2>Explore Our Features</h2>
        <div className="tabs">
          {tabFeatures.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <div className="tab-features-grid">
            {tabFeatures[activeTab].features.map((feature, index) => (
              <div key={index} className="tab-feature">
                <h4>{feature.name}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="comparison-section">
        <h2>How We Compare</h2>
        <div className="comparison-table">
          <div className="comparison-header">
            <div>Feature</div>
            <div>Cryptoplace</div>
            <div>Competitors</div>
          </div>
          {comparison.map((row, index) => (
            <div key={index} className="comparison-row">
              <div>{row.feature}</div>
              <div className="our-value">{row.us}</div>
              <div className="competitor-value">{row.competitors}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p>"{testimonial.comment}"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="features-cta">
        <div className="cta-content">
          <h2>Ready to Experience the Difference?</h2>
          <p>Join over 500,000 traders who trust Cryptoplace for their cryptocurrency trading needs</p>
          <div className="cta-buttons">
            <button className="cta-primary">Get Started Free</button>
            <button className="cta-secondary">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 