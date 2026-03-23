import React, { useState } from 'react';
import api from '../../services/api';

const ScreenshotUpload = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB');
      return;
    }

    setError('');
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a screenshot');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload to GitHub via backend
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload/screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      const screenshotUrl = uploadRes.data.url;
      if (!screenshotUrl) throw new Error('No URL returned from server');

      // Pass the GitHub URL to the parent component
      await onUpload(screenshotUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="form-group">
        <label>📸 Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
          disabled={uploading || loading}
        />
        {error && <small style={{ color: '#e53e3e', display: 'block', marginTop: '4px' }}>{error}</small>}
        <small style={{ color: '#718096', display: 'block', marginTop: '4px' }}>
          Max size: 10MB. Supported: JPG, PNG, GIF, WEBP
        </small>
      </div>

      {preview && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ width: '100%', backgroundColor: '#48bb78' }}
        disabled={uploading || loading || !file}
      >
        {uploading ? 'Uploading...' : 'Upload Screenshot'}
      </button>
    </div>
  );
};

export default ScreenshotUpload;