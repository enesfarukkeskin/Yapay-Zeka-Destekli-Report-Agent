namespace ReportAgent.API.Models.Entities
{
    public class Trend
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public Report Report { get; set; } = null!;
        public string MetricName { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty; // Up, Down, Stable
        public decimal ChangePercentage { get; set; }
        public string TimeFrame { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}