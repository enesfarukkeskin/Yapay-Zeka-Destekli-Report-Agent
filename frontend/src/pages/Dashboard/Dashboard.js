import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Components
import ReportCard from '../../components/ReportCard/ReportCard';
import StatsCards from '../../components/StatsCards/StatsCards';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

// Services
import { reportService } from '../../services/reportService';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    analyzedReports: 0,
    pendingReports: 0,
    successRate: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const reportsData = await reportService.getUserReports();
      setReports(reportsData);
      
      // İstatistikleri hesapla
      const totalReports = reportsData.length;
      const analyzedReports = reportsData.filter(r => r.isAnalyzed).length;
      const pendingReports = totalReports - analyzedReports;
      const successRate = totalReports > 0 ? Math.round((analyzedReports / totalReports) * 100) : 0;
      
      setStats({
        totalReports,
        analyzedReports,
        pendingReports,
        successRate
      });
    } catch (error) {
      console.error('Dashboard data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  const handleNewAnalysis = () => {
    navigate('/upload');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Report Agent Dashboard</h1>
        <button className="btn-primary" onClick={handleNewAnalysis}>
          <span className="icon">📄</span>
          Yeni Analiz
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="dashboard-content">
        <div className="section">
          <div className="section-header">
            <h2>Son Raporlarım</h2>
            <span className="report-count">{reports.length} rapor</span>
          </div>
          
          {reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Henüz rapor yüklenmemiş</h3>
              <p>İlk raporunuzu yükleyerek AI destekli analiz yapmaya başlayın.</p>
              <button className="btn-primary" onClick={handleNewAnalysis}>
                Rapor Yükle
              </button>
            </div>
          ) : (
            <div className="reports-grid">
              {reports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => handleReportClick(report.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;