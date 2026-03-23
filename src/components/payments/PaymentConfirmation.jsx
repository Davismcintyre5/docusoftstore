import React, { useState } from 'react';

const PaymentConfirmation = ({ onConfirm, loading }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) {
      setError('Please paste your M-Pesa confirmation message or transaction code.');
      return;
    }
    setError('');
    onConfirm(message);
  };

  return (
    <div>
      <div className="form-group">
        <label>📝 M-Pesa Confirmation Message</label>
        <textarea
          className="form-control"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the M-Pesa confirmation SMS or transaction code here. Example: 'Payment of KES 500 to DocuSoft confirmed. Ref: QWER1234'"
          disabled={loading}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '4px' }}>
          Paste the entire confirmation SMS or the transaction code.
        </small>
        {error && <small style={{ color: '#e53e3e', display: 'block', marginTop: '4px' }}>{error}</small>}
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ width: '100%', backgroundColor: '#48bb78' }}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Confirmation'}
      </button>
    </div>
  );
};

export default PaymentConfirmation;