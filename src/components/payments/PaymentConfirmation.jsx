import React, { useState } from 'react';

const PaymentConfirmation = ({ onConfirm, loading }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) {
      setError('Please enter a payment confirmation message');
      return;
    }
    setError('');
    onConfirm(message);
  };

  return (
    <div>
      <div className="form-group">
        <label>📝 Payment Confirmation</label>
        <textarea
          className="form-control"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: I have sent KES 500 to 0768784909 via M-Pesa. Reference: QWER1234"
          disabled={loading}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '4px' }}>
          Describe how you sent the payment (amount, phone number, transaction ID).
        </small>
        {error && <small style={{ color: '#e53e3e', display: 'block', marginTop: '4px' }}>{error}</small>}
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ width: '100%', backgroundColor: '#48bb78' }}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Confirm Payment'}
      </button>
    </div>
  );
};

export default PaymentConfirmation;