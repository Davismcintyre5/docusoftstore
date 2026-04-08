import React, { useState } from 'react';

const PaymentConfirmation = ({ onConfirm, loading }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) {
      setError('Please paste your M-Pesa confirmation message');
      return;
    }
    setError('');
    onConfirm(message);
  };

  return (
    <div>
      <textarea
        rows="4"
        className="input mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste M-Pesa confirmation SMS here..."
        disabled={loading}
      />
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <button onClick={handleSubmit} className="btn-primary w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Confirmation'}</button>
    </div>
  );
};

export default PaymentConfirmation;