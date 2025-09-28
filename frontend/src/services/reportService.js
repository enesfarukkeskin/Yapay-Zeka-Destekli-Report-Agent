const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ReportService {
  async getUserReports() {
    const response = await this.apiCall('GET', '/reports');
    return response;
  }

  async getReport(id) {
    const response = await this.apiCall('GET', `/reports/${id}`);
    
    // Transform API response to fix camelCase issues
    if (response) {
      return {
        ...response,
        kpis: response.kpis || response.kpIs || response.KPIs || [],
        trends: (response.trends || []).map(trend => ({
          ...trend,
          metricName: trend.metricName || trend.metric_name,
          changePercentage: trend.changePercentage || trend.change_percentage,
          timeFrame: trend.timeFrame || trend.time_frame
        })),
        actionItems: response.actionItems || []
      };
    }
    
    return response;
  }

  async uploadReport(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async analyzeReport(id) {
    const response = await this.apiCall('POST', `/reports/${id}/analyze`);
    return response;
  }

  async askQuestion(reportId, question) {
    const response = await this.apiCall('POST', `/reports/${reportId}/ask`, {
      question
    });
    return response;
  }

  async apiCall(method, endpoint, data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'API call failed');
    }

    return response.json();
  }

  getToken() {
    return localStorage.getItem('authToken') || 'demo-token';
  }
}

export const reportService = new ReportService();
