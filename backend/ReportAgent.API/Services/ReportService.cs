using Microsoft.EntityFrameworkCore;
using ReportAgent.API.Data;
using ReportAgent.API.Models.DTOs;
using ReportAgent.API.Models.Entities;

namespace ReportAgent.API.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ReportService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<ReportDto> UploadReportAsync(IFormFile file, int userId)
        {
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var report = new Report
            {
                FileName = fileName,
                OriginalFileName = file.FileName,
                FileType = file.ContentType,
                FilePath = filePath,
                FileSize = file.Length,
                UserId = userId
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            return new ReportDto
            {
                Id = report.Id,
                FileName = report.OriginalFileName,
                FileType = report.FileType,
                FileSize = report.FileSize,
                UploadedAt = report.UploadedAt,
                IsAnalyzed = report.IsAnalyzed
            };
        }

        public async Task<List<ReportDto>> GetUserReportsAsync(int userId)
        {
            return await _context.Reports
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.UploadedAt)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    FileName = r.OriginalFileName,
                    FileType = r.FileType,
                    FileSize = r.FileSize,
                    UploadedAt = r.UploadedAt,
                    IsAnalyzed = r.IsAnalyzed
                })
                .ToListAsync();
        }

        public async Task<ReportDetailDto?> GetReportAsync(int id, int userId)
        {
            var report = await _context.Reports
                .Include(r => r.AnalysisResults)
                .Include(r => r.KPIs)
                .Include(r => r.Trends)
                .Include(r => r.ActionItems)
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (report == null)
                return null;

            // Debug log ekleyelim
            Console.WriteLine($"Report {report.Id} - AnalysisResults count: {report.AnalysisResults?.Count ?? 0}");
            Console.WriteLine($"Report {report.Id} - KPIs count: {report.KPIs?.Count ?? 0}");
            Console.WriteLine($"Report {report.Id} - Trends count: {report.Trends?.Count ?? 0}");
            Console.WriteLine($"Report {report.Id} - ActionItems count: {report.ActionItems?.Count ?? 0}");

            return new ReportDetailDto
            {
                Id = report.Id,
                FileName = report.OriginalFileName,
                FileType = report.FileType,
                FileSize = report.FileSize,
                UploadedAt = report.UploadedAt,
                IsAnalyzed = report.IsAnalyzed,
                Summary = report.AnalysisResults.FirstOrDefault()?.Summary ?? "",
                KPIs = report.KPIs.Select(k => new KPIDto
                {
                    Name = k.Name,
                    Value = k.Value,
                    Unit = k.Unit,
                    Category = k.Category
                }).ToList(),
                Trends = report.Trends.Select(t => new TrendDto
                {
                    MetricName = t.MetricName,
                    Direction = t.Direction,
                    ChangePercentage = t.ChangePercentage,
                    TimeFrame = t.TimeFrame
                }).ToList(),
                ActionItems = report.ActionItems.Select(a => new ActionItemDto
                {
                    Title = a.Title,
                    Description = a.Description,
                    Priority = a.Priority,
                    Category = a.Category
                }).ToList()
            };
        }
    }
}
