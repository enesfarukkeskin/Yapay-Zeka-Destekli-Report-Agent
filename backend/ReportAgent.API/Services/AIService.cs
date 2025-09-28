using System.Text.Json;
using System.Text.Json.Serialization;
using ReportAgent.API.Data;
using ReportAgent.API.Models.DTOs;
using ReportAgent.API.Models.Entities;

namespace ReportAgent.API.Services
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AIService(HttpClient httpClient, ApplicationDbContext context, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _context = context;
            _configuration = configuration;
        }

        public async Task<AnalysisResultDto> AnalyzeReportAsync(ReportDetailDto report)
        {
            var aiServiceUrl = _configuration["AIService:BaseUrl"];
            var requestData = new
            {
                file_path = GetReportFilePath(report.Id),
                file_type = report.FileType
            };

            Console.WriteLine($"Sending to AI Service: {JsonSerializer.Serialize(requestData)}");
            var response = await _httpClient.PostAsJsonAsync($"{aiServiceUrl}/analyze", requestData);
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"AI Service Response: {result}");  // Debug
            var analysisData = JsonSerializer.Deserialize<AIAnalysisResponse>(result);
            
            // Debug: Deserialized data'yı kontrol et
            Console.WriteLine($"Deserialized Summary: {analysisData.Summary}");
            Console.WriteLine($"Deserialized KPIs count: {analysisData.KPIs?.Count ?? 0}");
            if (analysisData.KPIs?.Any() == true)
            {
                var firstKpi = analysisData.KPIs.First();
                Console.WriteLine($"First KPI - Name: '{firstKpi.Name}', Value: {firstKpi.Value}, Unit: '{firstKpi.Unit}', Category: '{firstKpi.Category}'");
            }
            Console.WriteLine($"Deserialized Trends count: {analysisData.Trends?.Count ?? 0}");
            Console.WriteLine($"Deserialized ActionItems count: {analysisData.ActionItems?.Count ?? 0}");

            // Veritabanına kaydet
            await SaveAnalysisResults(report.Id, analysisData);

            return new AnalysisResultDto
            {
                Summary = analysisData.Summary,
                KPIs = analysisData.KPIs,
                Trends = analysisData.Trends,
                ActionItems = analysisData.ActionItems
            };
        }

        public async Task<string> AskQuestionAsync(ReportDetailDto report, string question)
        {
            var aiServiceUrl = _configuration["AIService:BaseUrl"];
            var requestData = new
            {
                file_path = GetReportFilePath(report.Id),
                question = question
            };

            var response = await _httpClient.PostAsJsonAsync($"{aiServiceUrl}/ask", requestData);
            var result = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            
            return result?["answer"] ?? "Cevap alınamadı.";
        }

        private string GetReportFilePath(int reportId)
        {
            var report = _context.Reports.Find(reportId);
            return report?.FilePath ?? "";
        }

        private async Task SaveAnalysisResults(int reportId, AIAnalysisResponse analysisData)
        {
            Console.WriteLine($"=== SAVE ANALYSIS DEBUG ===");
            Console.WriteLine($"Report ID: {reportId}");
            Console.WriteLine($"KPIs to save: {analysisData.KPIs?.Count ?? 0}");
            if (analysisData.KPIs?.Count > 0)
            {
                Console.WriteLine($"First KPI to save: Name='{analysisData.KPIs[0].Name}', Value={analysisData.KPIs[0].Value}");
            }
            Console.WriteLine($"=============================");
            
            // Analysis Result kaydet
            var analysisResult = new AnalysisResult
            {
                ReportId = reportId,
                Summary = analysisData.Summary,
                InsightsJson = JsonSerializer.Serialize(analysisData)
            };
            _context.AnalysisResults.Add(analysisResult);

            // KPI'ları kaydet
            foreach (var kpi in analysisData.KPIs)
            {
                _context.KPIs.Add(new KPI
                {
                    ReportId = reportId,
                    Name = kpi.Name,
                    Value = kpi.Value,
                    Unit = kpi.Unit,
                    Category = kpi.Category
                });
            }

            // Trend'leri kaydet
            foreach (var trend in analysisData.Trends)
            {
                _context.Trends.Add(new Trend
                {
                    ReportId = reportId,
                    MetricName = trend.MetricName,
                    Direction = NormalizeDirection(trend.Direction),
                    ChangePercentage = trend.ChangePercentage,
                    TimeFrame = trend.TimeFrame
                });
            }

            // Action Item'ları kaydet
            foreach (var actionItem in analysisData.ActionItems)
            {
                _context.ActionItems.Add(new ActionItem
                {
                    ReportId = reportId,
                    Title = actionItem.Title,
                    Description = actionItem.Description,
                    Priority = NormalizePriority(actionItem.Priority),
                    Category = actionItem.Category
                });
            }

            // Report'u analyzed olarak işaretle
            var report = await _context.Reports.FindAsync(reportId);
            if (report != null)
            {
                report.IsAnalyzed = true;
            }

            await _context.SaveChangesAsync();
        }

        private string NormalizePriority(string priority)
        {
            if (string.IsNullOrWhiteSpace(priority))
                return "Medium"; // Default değer

            // Normalize the priority to match database constraint
            var normalized = priority.Trim().ToLowerInvariant();
            
            return normalized switch
            {
                "high" or "yüksek" or "critical" or "urgent" => "High",
                "medium" or "orta" or "normal" or "moderate" => "Medium", 
                "low" or "düşük" or "minor" => "Low",
                _ => "Medium" // Default for unknown values
            };
        }

        private string NormalizeDirection(string direction)
        {
            if (string.IsNullOrWhiteSpace(direction))
                return "Stable"; // Default değer

            // Normalize the direction to match database constraint
            var normalized = direction.Trim().ToLowerInvariant();
            
            return normalized switch
            {
                "up" or "yukarı" or "artış" or "increase" or "rising" => "Up",
                "down" or "aşağı" or "azalış" or "decrease" or "falling" => "Down",
                "stable" or "stabil" or "sabit" or "steady" or "unchanged" => "Stable",
                _ => "Stable" // Default for unknown values
            };
        }
    }

    public class AIAnalysisResponse
    {
        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;
        
        [JsonPropertyName("kpis")]
        public List<KPIDto> KPIs { get; set; } = new();
        
        [JsonPropertyName("trends")]
        public List<TrendDto> Trends { get; set; } = new();
        
        [JsonPropertyName("action_items")]
        public List<ActionItemDto> ActionItems { get; set; } = new();
    }
}