namespace ReportAgent.API.Models.Entities
{
    public class Report
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsAnalyzed { get; set; } = false;
        public List<AnalysisResult> AnalysisResults { get; set; } = new();
        public List<KPI> KPIs { get; set; } = new();
        public List<Trend> Trends { get; set; } = new();
        public List<ActionItem> ActionItems { get; set; } = new();
    }
}