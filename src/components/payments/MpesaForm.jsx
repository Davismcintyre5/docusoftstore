import React, { useState } from 'react';

const MpesaForm = ({ onSubmit, loading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (phone) => {
    const regex = /^(?:\+254|0)[17]\d{8}$/;
    return regex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }
    setError('');
    onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>📱 M-Pesa Phone Number</label>
        <input
          type="tel"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712345678"
          required
          disabled={loading}
        />
        {error && <small style={{ color: '#e53e3e', marginTop: '4px', display: 'block' }}>{error}</small>}
        <small style={{ color: '#718096' }}>You will receive an STK push prompt on this phone</small>
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>
    </form>
  );
};

export default MpesaForm;