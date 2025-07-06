-- Cryptoplace Database Schema
-- PostgreSQL Database Setup

-- Create database and user (run as postgres superuser)
-- CREATE DATABASE cryptoplace_db;
-- CREATE USER cryptoplace_user WITH PASSWORD 'cryptoplace_password';
-- GRANT ALL PRIVILEGES ON DATABASE cryptoplace_db TO cryptoplace_user;

-- Connect to cryptoplace_db and run the following

-- Enable UUID extension (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    account_locked BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Portfolios table
CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crypto_symbol VARCHAR(10) NOT NULL,
    crypto_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(18,8) NOT NULL,
    average_price DECIMAL(18,8) NOT NULL,
    current_price DECIMAL(18,8),
    total_value DECIMAL(18,8),
    profit_loss DECIMAL(18,8),
    profit_loss_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id BIGINT REFERENCES portfolios(id) ON DELETE SET NULL,
    crypto_symbol VARCHAR(10) NOT NULL,
    crypto_name VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- BUY, SELL, TRANSFER_IN, TRANSFER_OUT, etc.
    quantity DECIMAL(18,8) NOT NULL,
    price DECIMAL(18,8) NOT NULL,
    total_amount DECIMAL(18,8) NOT NULL,
    fee DECIMAL(18,8) DEFAULT 0,
    notes TEXT,
    transaction_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP
);

-- Price alerts table
CREATE TABLE price_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crypto_symbol VARCHAR(10) NOT NULL,
    crypto_name VARCHAR(100) NOT NULL,
    target_price DECIMAL(18,8) NOT NULL,
    current_price DECIMAL(18,8),
    alert_type VARCHAR(20) NOT NULL, -- PRICE_ABOVE, PRICE_BELOW, PRICE_CHANGE_PERCENT
    message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_crypto_symbol ON portfolios(crypto_symbol);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_crypto_symbol ON transactions(crypto_symbol);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_crypto_symbol ON price_alerts(crypto_symbol);
CREATE INDEX idx_price_alerts_is_active ON price_alerts(is_active);

-- Create unique constraint for user-crypto combination in portfolios
CREATE UNIQUE INDEX idx_unique_user_crypto ON portfolios(user_id, crypto_symbol);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role, email_verified, enabled)
VALUES ('admin', 'admin@cryptoplace.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'Admin', 'User', 'ADMIN', TRUE, TRUE);

-- Test user (password: password123)
INSERT INTO users (username, email, password, first_name, last_name, role, email_verified, enabled)
VALUES ('testuser', 'test@example.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'Test', 'User', 'USER', TRUE, TRUE);

-- Sample portfolio data
INSERT INTO portfolios (user_id, crypto_symbol, crypto_name, quantity, average_price, current_price, total_value)
VALUES 
    (2, 'BTC', 'Bitcoin', 0.5, 45000.00, 43250.00, 21625.00),
    (2, 'ETH', 'Ethereum', 2.1, 2800.00, 2650.00, 5565.00),
    (2, 'BNB', 'Binance Coin', 5.0, 300.00, 315.00, 1575.00);

-- Sample transactions
INSERT INTO transactions (user_id, portfolio_id, crypto_symbol, crypto_name, transaction_type, quantity, price, total_amount, status, executed_at)
VALUES 
    (2, 1, 'BTC', 'Bitcoin', 'BUY', 0.5, 45000.00, 22500.00, 'CONFIRMED', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (2, 2, 'ETH', 'Ethereum', 'BUY', 2.1, 2800.00, 5880.00, 'CONFIRMED', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (2, 3, 'BNB', 'Binance Coin', 'BUY', 5.0, 300.00, 1500.00, 'CONFIRMED', CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Sample price alerts
INSERT INTO price_alerts (user_id, crypto_symbol, crypto_name, target_price, alert_type, message, is_active)
VALUES 
    (2, 'BTC', 'Bitcoin', 50000.00, 'PRICE_ABOVE', 'Bitcoin reached $50,000!', TRUE),
    (2, 'ETH', 'Ethereum', 2500.00, 'PRICE_BELOW', 'Ethereum dropped below $2,500', TRUE);

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cryptoplace_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cryptoplace_user;

-- View for user statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(DISTINCT p.id) as portfolio_count,
    COUNT(DISTINCT t.id) as transaction_count,
    COUNT(DISTINCT pa.id) as alert_count,
    COALESCE(SUM(p.total_value), 0) as total_portfolio_value,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN portfolios p ON u.id = p.user_id
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN price_alerts pa ON u.id = pa.user_id
GROUP BY u.id, u.username, u.email, u.created_at, u.last_login;

-- Grant access to the view
GRANT SELECT ON user_statistics TO cryptoplace_user; 