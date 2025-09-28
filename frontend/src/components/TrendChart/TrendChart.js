import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './TrendChart.css';

const TrendChart = ({ trends }) => {
  const getBarColor = (direction) => {
    switch (direction) {
      case 'Up': return '#22c55e';
      case 'Down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const chartData = trends.map(trend => ({
    name: trend.metricName,
    value: Math.abs(trend.changePercentage),
    direction: trend.direction,
    color: getBarColor(trend.direction)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            <span className={`trend-indicator ${data.direction.toLowerCase()}`}>
              {data.direction === 'Up' ? '↗' : data.direction === 'Down' ? '↘' : '→'}
            </span>
            {data.direction === 'Down' ? '-' : '+'}%{data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="trend-chart">
      <div className="chart-header">
        <h3>📈 Trend Analizi</h3>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-color up"></span>
            Artış
          </span>
          <span className="legend-item">
            <span className="legend-color down"></span>
            Azalış
          </span>
          <span className="legend-item">
            <span className="legend-color stable"></span>
            Stabil
          </span>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;