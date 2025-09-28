import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReportDetail.css';

// Components
import KPICard from '../../components/KPICard/KPICard';
import TrendChart from '../../components/TrendChart/TrendChart';
import ActionItemsList from '../../components/ActionItemsList/ActionItemsList';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

// Services
import { reportService } from '../../services/reportService';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    loadReportDetail();
  }, [id]);

  const loadReportDetail = async () => {
    try {
      setLoading(true);
      const reportData = await reportService.getReport(id);
      
      // Debug: Gelen veriyi konsola yazdır
      console.log('=== DEBUG REPORT DATA ===');
      console.log('Full API Response:', reportData);
      console.log('Available keys:', Object.keys(reportData));
      console.log('Raw KPIs (kpis):', reportData.kpis);
      console.log('Raw KPIs (kpIs):', reportData.kpIs);
      console.log('Raw KPIs (KPIs):', reportData.KPIs); 
      console.log('Raw Trends:', reportData.trends);
      console.log('Raw ActionItems:', reportData.actionItems);
      console.log('========================');
      
      // Data transformation: camelCase API response'unu normalize et
      const kpiData = reportData.kpis || reportData.kpIs || reportData.KPIs || [];
      const trendData = reportData.trends || reportData.Trends || [];
      const actionData = reportData.actionItems || reportData.ActionItems || [];
      
      console.log('=== AFTER NORMALIZATION ===');
      console.log('KPI count:', kpiData.length);
      console.log('Trends count:', trendData.length); 
      console.log('Actions count:', actionData.length);
      console.log('==========================');
      
      const normalizedReport = {
        ...reportData,
        kpis: kpiData,
        trends: trendData.map(trend => ({
          ...trend,
          metricName: trend.metricName || trend.metric_name,
          changePercentage: trend.changePercentage || trend.change_percentage,
          timeFrame: trend.timeFrame || trend.time_frame
        })),
        actionItems: actionData
      };
      
      console.log('Final normalized report:', normalizedReport);
      setReport(normalizedReport);

      // Eğer analiz edilmemişse otomatik analiz başlat
      if (!reportData.isAnalyzed) {
        startAnalysis();
      }
    } catch (error) {
      console.error('Report loading error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async () => {
    try {
      setAnalyzing(true);
      const analysisResult = await reportService.analyzeReport(id);
      
      // Analiz sonucunu raporu yeniden yükleyerek al
      await loadReportDetail();
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analiz hatası: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!report) {
    return (
      <div className="error-state">
        <h2>Rapor bulunamadı</h2>
        <button onClick={() => navigate('/')}>Dashboard'a Dön</button>
      </div>
    );
  }

  return (
    <div className="report-detail">
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
        <div className="report-info">
          <h1>{report.fileName}</h1>
          <div className="report-meta">
            <span>Yüklenme: {new Date(report.uploadedAt).toLocaleDateString()}</span>
            <span>Boyut: {(report.fileSize / 1024).toFixed(1)} KB</span>
            <span className={`status ${report.isAnalyzed ? 'analyzed' : 'pending'}`}>
              {report.isAnalyzed ? '✅ Analiz Edildi' : '⏳ Beklemede'}
            </span>
          </div>
        </div>
        {!report.isAnalyzed && (
          <button 
            className="btn-primary" 
            onClick={startAnalysis}
            disabled={analyzing}
          >
            {analyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
          </button>
        )}
      </div>

      {analyzing && (
        <div className="analysis-progress">
          <div className="progress-content">
            <div className="spinner"></div>
            <div>
              <h3>AI Analizi Yapılıyor...</h3>
              <p>Bu işlem birkaç dakika sürebilir</p>
            </div>
          </div>
        </div>
      )}

      {report.isAnalyzed && (
        <>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              📋 Özet
            </button>
            <button 
              className={`tab ${activeTab === 'kpis' ? 'active' : ''}`}
              onClick={() => setActiveTab('kpis')}
            >
              📊 KPI'lar
            </button>
            <button 
              className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              📈 Trendler
            </button>
            <button 
              className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              ✅ Eylem Planı
            </button>
            <button 
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Soru Sor
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'summary' && (
              <div className="summary-tab">
                <div className="summary-card">
                  <h3>📋 Analiz Özeti</h3>
                  <div className="summary-content">
                    {report.summary || 'Özet bilgisi mevcut değil.'}
                  </div>
                </div>
                
                <div className="quick-stats">
                  <div className="stat-item">
                    <span className="stat-number">{report.kpis?.length || 0}</span>
                    <span className="stat-label">KPI Tespit Edildi</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{report.trends?.length || 0}</span>
                    <span className="stat-label">Trend Analiz Edildi</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{report.actionItems?.length || 0}</span>
                    <span className="stat-label">Eylem Maddesi</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kpis' && (
              <div className="kpis-tab">
                {report.kpis && report.kpis.length > 0 ? (
                  <div className="kpis-grid">
                    {report.kpis.map((kpi, index) => (
                      <KPICard key={index} kpi={kpi} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-tab">
                    <p>KPI bilgisi mevcut değil.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="trends-tab">
                {report.trends && report.trends.length > 0 ? (
                  <>
                    <TrendChart trends={report.trends} />
                    <div className="trends-list">
                      {report.trends.map((trend, index) => (
                        <div key={index} className="trend-item">
                          <div className="trend-header">
                            <h4>{trend.metricName}</h4>
                            <span className={`trend-direction ${trend.direction.toLowerCase()}`}>
                              {trend.direction === 'Up' ? '📈' : trend.direction === 'Down' ? '📉' : '📊'}
                              {trend.direction}
                            </span>
                          </div>
                          <div className="trend-details">
                            <span>Değişim: %{trend.changePercentage}</span>
                            <span>Dönem: {trend.timeFrame}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-tab">
                    <p>Trend analizi mevcut değil.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <ActionItemsList actionItems={report.actionItems || []} />
            )}

            {activeTab === 'chat' && (
              <ChatInterface reportId={id} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportDetail;