namespace ReportAgent.API.Models.Entities
{
    public class KPI
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public Report Report { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}