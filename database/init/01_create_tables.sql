-- Report Agent Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    Id SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(512) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS Reports (
    Id SERIAL PRIMARY KEY,
    FileName VARCHAR(255) NOT NULL,
    OriginalFileName VARCHAR(255) NOT NULL,
    FileType VARCHAR(100) NOT NULL,
    FilePath VARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    UserId INT NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    UploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsAnalyzed BOOLEAN DEFAULT FALSE
);

-- AnalysisResults table
CREATE TABLE IF NOT EXISTS AnalysisResults (
    Id SERIAL PRIMARY KEY,
    ReportId INT NOT NULL REFERENCES Reports(Id) ON DELETE CASCADE,
    Summary TEXT NOT NULL,
    InsightsJson TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KPIs table
CREATE TABLE IF NOT EXISTS KPIs (
    Id SERIAL PRIMARY KEY,
    ReportId INT NOT NULL REFERENCES Reports(Id) ON DELETE CASCADE,
    Name VARCHAR(255) NOT NULL,
    Value DECIMAL(18,2) NOT NULL,
    Unit VARCHAR(50),
    Category VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trends table
CREATE TABLE IF NOT EXISTS Trends (
    Id SERIAL PRIMARY KEY,
    ReportId INT NOT NULL REFERENCES Reports(Id) ON DELETE CASCADE,
    MetricName VARCHAR(255) NOT NULL,
    Direction VARCHAR(20) NOT NULL CHECK (Direction IN ('Up', 'Down', 'Stable')),
    ChangePercentage DECIMAL(10,2) NOT NULL,
    TimeFrame VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ActionItems table
CREATE TABLE IF NOT EXISTS ActionItems (
    Id SERIAL PRIMARY KEY,
    ReportId INT NOT NULL REFERENCES Reports(Id) ON DELETE CASCADE,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Priority VARCHAR(20) NOT NULL CHECK (Priority IN ('High', 'Medium', 'Low')),
    Category VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_userid ON Reports(UserId);
CREATE INDEX IF NOT EXISTS idx_analysisresults_reportid ON AnalysisResults(ReportId);
CREATE INDEX IF NOT EXISTS idx_kpis_reportid ON KPIs(ReportId);
CREATE INDEX IF NOT EXISTS idx_trends_reportid ON Trends(ReportId);
CREATE INDEX IF NOT EXISTS idx_actionitems_reportid ON ActionItems(ReportId);
