using ReportAgent.API.Models.DTOs;
using ReportAgent.API.Models.Entities;

namespace ReportAgent.API.Services
{
    public interface IAIService
    {
        Task<AnalysisResultDto> AnalyzeReportAsync(ReportDetailDto report);
        Task<string> AskQuestionAsync(ReportDetailDto report, string question);
    }
}