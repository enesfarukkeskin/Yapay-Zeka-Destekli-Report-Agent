using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReportAgent.API.Services;
using ReportAgent.API.Models.DTOs;

namespace ReportAgent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Demo için geçici olarak kapatıldı
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IAIService _aiService;

        public ReportsController(IReportService reportService, IAIService aiService)
        {
            _reportService = reportService;
            _aiService = aiService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadReport([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var userId = GetCurrentUserId();
            var result = await _reportService.UploadReportAsync(file, userId);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetReports()
        {
            var userId = GetCurrentUserId();
            var reports = await _reportService.GetUserReportsAsync(userId);
            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport(int id)
        {
            var userId = GetCurrentUserId();
            var report = await _reportService.GetReportAsync(id, userId);
            
            if (report == null)
                return NotFound();

            return Ok(report);
        }

        [HttpPost("{id}/analyze")]
        public async Task<IActionResult> AnalyzeReport(int id)
        {
            var userId = GetCurrentUserId();
            var report = await _reportService.GetReportAsync(id, userId);
            
            if (report == null)
                return NotFound();

            var analysisResult = await _aiService.AnalyzeReportAsync(report);
            return Ok(analysisResult);
        }

        [HttpPost("{id}/ask")]
        public async Task<IActionResult> AskQuestion(int id, [FromBody] AskQuestionDto request)
        {
            var userId = GetCurrentUserId();
            var report = await _reportService.GetReportAsync(id, userId);
            
            if (report == null)
                return NotFound();

            var answer = await _aiService.AskQuestionAsync(report, request.Question);
            return Ok(new { answer });
        }

        private int GetCurrentUserId()
        {
            // JWT token'dan user ID'yi çıkar
            var userIdClaim = User.Claims.FirstOrDefault(x => x.Type == "userId");
            return int.Parse(userIdClaim?.Value ?? "1");
        }
    }
}