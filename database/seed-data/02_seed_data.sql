-- Demo user and test data

-- Insert demo user
INSERT INTO Users (Email, PasswordHash, FirstName, LastName) 
VALUES ('demo@example.com', '$2a$11$demo.password.hash.here', 'Demo', 'User')
ON CONFLICT (Email) DO NOTHING;

-- Insert sample report (optional - for testing)
INSERT INTO Reports (FileName, OriginalFileName, FileType, FilePath, FileSize, UserId, IsAnalyzed)
SELECT 'sample-report.xlsx', 'Sample Report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
       '/uploads/sample-report.xlsx', 15360, u.Id, TRUE
FROM Users u WHERE u.Email = 'demo@example.com'
ON CONFLICT DO NOTHING;

-- Sample analysis data for the demo report
INSERT INTO AnalysisResults (ReportId, Summary, InsightsJson)
SELECT r.Id, 'Bu örnek rapor, satış performansını göstermektedir. Genel olarak pozitif bir trend gözlenmekte ve Q4 hedeflerine ulaşma konusunda başarılı gidişat söz konusudur.',
       '{"total_records": 1250, "data_quality": 95, "completion_rate": 98}'
FROM Reports r 
JOIN Users u ON r.UserId = u.Id 
WHERE u.Email = 'demo@example.com' AND r.OriginalFileName = 'Sample Report.xlsx'
ON CONFLICT DO NOTHING;

-- Sample KPIs
INSERT INTO KPIs (ReportId, Name, Value, Unit, Category)
SELECT r.Id, 'Toplam Satış', 2750000, 'TL', 'Revenue'
FROM Reports r 
JOIN Users u ON r.UserId = u.Id 
WHERE u.Email = 'demo@example.com' AND r.OriginalFileName = 'Sample Report.xlsx'
ON CONFLICT DO NOTHING;

INSERT INTO KPIs (ReportId, Name, Value, Unit, Category)
SELECT r.Id, 'Müşteri Sayısı', 1250, 'adet', 'Customer'
FROM Reports r 
JOIN Users u ON r.UserId = u.Id 
WHERE u.Email = 'demo@example.com' AND r.OriginalFileName = 'Sample Report.xlsx'
ON CONFLICT DO NOTHING;

-- Sample Trends
INSERT INTO Trends (ReportId, MetricName, Direction, ChangePercentage, TimeFrame)
SELECT r.Id, 'Satış Trendi', 'Up', 15.5, 'Son 6 Ay'
FROM Reports r 
JOIN Users u ON r.UserId = u.Id 
WHERE u.Email = 'demo@example.com' AND r.OriginalFileName = 'Sample Report.xlsx'
ON CONFLICT DO NOTHING;

-- Sample Action Items
INSERT INTO ActionItems (ReportId, Title, Description, Priority, Category)
SELECT r.Id, 'Pazarlama Kampanyası Güçlendir', 'Mevcut pozitif trendi sürdürmek için pazarlama bütçesi artırılmalı.', 'High', 'Marketing'
FROM Reports r 
JOIN Users u ON r.UserId = u.Id 
WHERE u.Email = 'demo@example.com' AND r.OriginalFileName = 'Sample Report.xlsx'
ON CONFLICT DO NOTHING;