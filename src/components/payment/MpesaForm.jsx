import React, { useState } from 'react';

const MpesaForm = ({ onSubmit, loading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (phone) => /^(?:\+254|0)[17]\d{8}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setError('Enter valid Kenyan phone (e.g., 0712345678)');
      return;
    }
    setError('');
    onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="label">📱 M-Pesa Phone Number</label>
        <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" required disabled={loading} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Processing...' : 'Pay with M-Pesa'}</button>
    </form>
  );
};

export default MpesaForm;