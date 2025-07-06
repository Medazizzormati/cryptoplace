import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBuyCryptocurrencyMutation } from '../store/api/portfolioApi';
import { closeBuyModal, updateTransactionForm, addAlert } from '../store/slices/portfolioSlice';
import './Modal.css';

const BuyModal = () => {
  const dispatch = useDispatch();
  const { buyModalOpen, selectedCoin, transactionForm } = useSelector(state => state.portfolio);
  const [buyCrypto, { isLoading }] = useBuyCryptocurrencyMutation();

  const handleClose = () => {
    dispatch(closeBuyModal());
  };

  const handleInputChange = (field, value) => {
    dispatch(updateTransactionForm({ [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await buyCrypto({
        symbol: transactionForm.symbol,
        amount: parseFloat(transactionForm.amount),
        price: parseFloat(transactionForm.price)
      }).unwrap();

      dispatch(addAlert({
        type: 'success',
        message: `Successfully bought ${transactionForm.amount} ${transactionForm.symbol}`
      }));
      
      dispatch(closeBuyModal());
    } catch (error) {
      dispatch(addAlert({
        type: 'error',
        message: error?.data?.message || 'Failed to buy cryptocurrency'
      }));
    }
  };

  if (!buyModalOpen) return null;

  const totalCost = (parseFloat(transactionForm.amount) || 0) * (parseFloat(transactionForm.price) || 0);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Buy {selectedCoin?.name || transactionForm.symbol}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>Cryptocurrency</label>
            <input
              type="text"
              value={transactionForm.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              placeholder="BTC, ETH, etc."
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.00000001"
              value={transactionForm.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={transactionForm.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="transaction-summary">
            <div className="summary-row">
              <span>Total Cost:</span>
              <span className="total-cost">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="confirm-btn buy-btn">
              {isLoading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyModal; 