import React from 'react';
import './Pricing.css';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '',
      features: [
        'Real-time market data',
        'Basic portfolio tracking',
        'Up to 3 price alerts',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: [
        'Everything in Basic',
        'Advanced analytics',
        'Unlimited price alerts',
        'Priority support',
        'Portfolio insights'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      features: [
        'Everything in Pro',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced reporting'
      ],
      popular: false
    }
  ];

  return (
    <div className="pricing-container">
      <div className="pricing-hero">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your cryptocurrency trading needs</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
            <button className="plan-button">Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing; 