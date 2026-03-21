import React from 'react';

const ImageViewer = ({ url, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '90vw', maxHeight: '90vh', padding: 0 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Payment Screenshot</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <img src={url} alt="Payment Screenshot" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;