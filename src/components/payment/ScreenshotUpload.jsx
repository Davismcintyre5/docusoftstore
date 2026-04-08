import React, { useState } from 'react';

const ScreenshotUpload = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Only image files allowed');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('Max size 10MB');
      return;
    }
    setError('');
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!file) {
      setError('Please select a screenshot');
      return;
    }
    const formData = new FormData();
    formData.append('screenshot', file);
    onUpload(formData);
  };

  return (
    <div>
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="input" />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      {preview && <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded mb-3" />}
      <button onClick={handleSubmit} className="btn-primary w-full" disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Screenshot'}</button>
    </div>
  );
};

export default ScreenshotUpload;