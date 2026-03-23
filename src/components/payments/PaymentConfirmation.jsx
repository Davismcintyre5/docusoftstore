import React, { useState } from 'react';

const PaymentConfirmation = ({ onConfirm, loading }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError('Please paste the M-Pesa confirmation message or enter the transaction code');
      return;
    }
    setError('');
    onConfirm(trimmed);
  };

  return (
    <div>
      <div className="form-group">
        <label>📱 M-Pesa Confirmation</label>
        <textarea
          className="form-control"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the M-Pesa confirmation message you received or enter the transaction code here..."
          disabled={loading}
          style={{ fontFamily: 'monospace', fontSize: '13px' }}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '4px' }}>
          Example: "Confirmed. KES 500.00 sent to DocuSoft on 23/03/2026 at 12:30 PM. New balance: KES 2,500.00. Transaction code: QWER1234"
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