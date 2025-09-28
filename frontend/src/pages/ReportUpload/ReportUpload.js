import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './ReportUpload.css';

// Services
import { reportService } from '../../services/reportService';

const ReportUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simüle upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await reportService.uploadReport(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedFile(response);
      
      // 2 saniye sonra detay sayfasına yönlendir
      setTimeout(() => {
        navigate(`/report/${response.id}`);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yükleme hatası: ' + error.message);
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="report-upload">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Rapor Yükle</h1>
          <p>Excel, CSV veya PDF formatında raporlarınızı yükleyerek AI destekli analiz yapın</p>
        </div>

        {!uploading && !uploadedFile && (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="upload-icon">📁</div>
              {isDragActive ? (
                <p>Dosyayı buraya bırakın...</p>
              ) : (
                <>
                  <p>Dosyayı sürükleyip bırakın veya tıklayarak seçin</p>
                  <div className="supported-formats">
                    <span>Desteklenen formatlar:</span>
                    <div className="format-tags">
                      <span className="format-tag">.xlsx</span>
                      <span className="format-tag">.xls</span>
                      <span className="format-tag">.csv</span>
                      <span className="format-tag">.pdf</span>
                    </div>
                  </div>
                  <p className="size-limit">Maksimum dosya boyutu: 10MB</p>
                </>
              )}
            </div>
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="upload-icon spinning">⚙️</div>
            <h3>Dosya yükleniyor...</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>{uploadProgress}% tamamlandı</p>
          </div>
        )}

        {uploadedFile && (
          <div className="upload-success">
            <div className="success-icon">✅</div>
            <h3>Dosya başarıyla yüklendi!</h3>
            <p>{uploadedFile.fileName}</p>
            <p>AI analizi başlatılıyor...</p>
          </div>
        )}

        <div className="upload-features">
          <div className="feature">
            <span className="feature-icon">🧠</span>
            <h4>AI Destekli Analiz</h4>
            <p>Verileriniz otomatik olarak analiz edilir</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h4>KPI Çıkarımı</h4>
            <p>Önemli metrikleri otomatik belirler</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <h4>Trend Analizi</h4>
            <p>Veri trendlerini görselleştirir</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h4>Eylem Önerileri</h4>
            <p>Sonuçlara dayalı aksiyon maddeleri</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;