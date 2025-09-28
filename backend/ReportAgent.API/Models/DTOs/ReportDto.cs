using System.Text.Json.Serialization;

namespace ReportAgent.API.Models.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public bool IsAnalyzed { get; set; }
    }

    public class ReportDetailDto : ReportDto
    {
        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;
        
        [JsonPropertyName("kpis")]
        public List<KPIDto> KPIs { get; set; } = new();
        
        [JsonPropertyName("trends")]
        public List<TrendDto> Trends { get; set; } = new();
        
        [JsonPropertyName("actionItems")]
        public List<ActionItemDto> ActionItems { get; set; } = new();
    }

    public class KPIDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        
        [JsonPropertyName("value")]
        public decimal Value { get; set; }
        
        [JsonPropertyName("unit")]
        public string Unit { get; set; } = string.Empty;
        
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;
    }

    public class TrendDto
    {
        [JsonPropertyName("metric_name")]
        public string MetricName { get; set; } = string.Empty;
        
        [JsonPropertyName("direction")]
        public string Direction { get; set; } = string.Empty;
        
        [JsonPropertyName("change_percentage")]
        public decimal ChangePercentage { get; set; }
        
        [JsonPropertyName("time_frame")]
        public string TimeFrame { get; set; } = string.Empty;
    }

    public class ActionItemDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;
        
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
        
        [JsonPropertyName("priority")]
        public string Priority { get; set; } = string.Empty;
        
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;
    }

    public class AskQuestionDto
    {
        public string Question { get; set; } = string.Empty;
    }

    public class AnalysisResultDto
    {
        public string Summary { get; set; } = string.Empty;
        public List<KPIDto> KPIs { get; set; } = new();
        public List<TrendDto> Trends { get; set; } = new();
        public List<ActionItemDto> ActionItems { get; set; } = new();
    }
}