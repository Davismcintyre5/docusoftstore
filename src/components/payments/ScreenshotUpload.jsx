import React, { useState } from 'react';

const ScreenshotUpload = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate file type
    if (!selected.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError('File too large. Max size 5MB.');
      setFile(null);
      setPreview(null);
      return;
    }

    setError('');
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = () => {
    if (!file) {
      setError('Please select a screenshot');
      return;
    }
    onUpload(file);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="form-group">
        <label>📸 Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
          disabled={loading}
        />
        {error && <small style={{ color: '#e53e3e', marginTop: '4px', display: 'block' }}>{error}</small>}
        <small style={{ color: '#718096' }}>Upload a clear screenshot of your M-Pesa payment confirmation</small>
      </div>

      {preview && (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ width: '100%', backgroundColor: '#48bb78' }}
        disabled={loading || !file}
      >
        {loading ? 'Uploading...' : 'Upload Screenshot'}
      </button>
    </div>
  );
};

export default ScreenshotUpload;