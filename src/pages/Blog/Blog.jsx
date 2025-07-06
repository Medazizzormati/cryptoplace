import React from 'react';
import './Blog.css';

const Blog = () => {
  const articles = [
    {
      title: 'Understanding Bitcoin Market Trends',
      excerpt: 'Learn how to analyze Bitcoin price movements and market patterns for better trading decisions.',
      date: 'January 15, 2024',
      readTime: '5 min read',
      category: 'Analysis'
    },
    {
      title: 'Cryptocurrency Security Best Practices',
      excerpt: 'Essential security measures every crypto trader should implement to protect their assets.',
      date: 'January 10, 2024',
      readTime: '7 min read',
      category: 'Security'
    },
    {
      title: 'DeFi: The Future of Finance',
      excerpt: 'Exploring decentralized finance and its potential impact on traditional banking systems.',
      date: 'January 5, 2024',
      readTime: '6 min read',
      category: 'DeFi'
    }
  ];

  return (
    <div className="blog-container">
      <div className="blog-hero">
        <h1>Crypto Blog</h1>
        <p>Stay updated with the latest cryptocurrency news, insights, and market analysis</p>
      </div>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <article key={index} className="article-card">
            <div className="article-category">{article.category}</div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div className="article-meta">
              <span className="date">{article.date}</span>
              <span className="read-time">{article.readTime}</span>
            </div>
            <button className="read-more">Read More</button>
          </article>
        ))}
      </div>

      <div className="blog-cta">
        <h2>Stay Connected</h2>
        <p>Subscribe to our newsletter for the latest crypto insights</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Blog; 