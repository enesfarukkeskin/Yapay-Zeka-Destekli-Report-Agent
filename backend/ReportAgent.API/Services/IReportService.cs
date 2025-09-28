using ReportAgent.API.Models.DTOs;
using ReportAgent.API.Models.Entities;

namespace ReportAgent.API.Services
{
    public interface IReportService
    {
        Task<ReportDto> UploadReportAsync(IFormFile file, int userId);
        Task<List<ReportDto>> GetUserReportsAsync(int userId);
        Task<ReportDetailDto?> GetReportAsync(int id, int userId);
    }
}