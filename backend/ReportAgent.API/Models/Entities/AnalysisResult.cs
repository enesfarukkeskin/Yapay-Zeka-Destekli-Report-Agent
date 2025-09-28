namespace ReportAgent.API.Models.Entities
{
    public class AnalysisResult
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public Report Report { get; set; } = null!;
        public string Summary { get; set; } = string.Empty;
        public string InsightsJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}