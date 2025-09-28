namespace ReportAgent.API.Models.Entities
{
    public class ActionItem
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public Report Report { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty; // High, Medium, Low
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}