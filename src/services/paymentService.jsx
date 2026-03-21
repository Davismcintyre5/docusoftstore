import api from './api';

export const initiateManualPayment = async (itemId, itemType) => {
  const { data } = await api.post('/payments/manual', { itemId, itemType });
  return data;
};

export const initiateSTKPush = async (itemId, itemType, phoneNumber) => {
  const { data } = await api.post('/payments/stkpush', { itemId, itemType, phoneNumber });
  return data;
};

export const uploadScreenshot = async (transactionId, file) => {
  const formData = new FormData();
  formData.append('screenshot', file);
  const { data } = await api.post(`/payments/screenshot/${transactionId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const checkPaymentStatus = async (itemId) => {
  const { data } = await api.get(`/payments/status/${itemId}`);
  return data;
};

export const getUserPendingTransactions = async () => {
  const { data } = await api.get('/payments/pending');
  return data;
};