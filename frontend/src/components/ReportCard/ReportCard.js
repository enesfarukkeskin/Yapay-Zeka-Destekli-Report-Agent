import React from 'react';
import './ReportCard.css';

const ReportCard = ({ report, onClick }) => {
  const getFileIcon = (fileType) => {
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('csv')) return '📄';
    if (fileType.includes('pdf')) return '📋';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="report-card" onClick={onClick}>
      <div className="report-card-header">
        <span className="file-icon">{getFileIcon(report.fileType)}</span>
        <div className="file-info">
          <h3 className="file-name">{report.fileName}</h3>
          <p className="file-details">
            {formatFileSize(report.fileSize)} • {formatDate(report.uploadedAt)}
          </p>
        </div>
      </div>
      
      <div className="report-card-footer">
        <span className={`status-badge ${report.isAnalyzed ? 'analyzed' : 'pending'}`}>
          {report.isAnalyzed ? '✅ Analiz Edildi' : '⏳ Beklemede'}
        </span>
      </div>
    </div>
  );
};

export default ReportCard;