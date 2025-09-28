using Microsoft.EntityFrameworkCore;
using ReportAgent.API.Models.Entities;

namespace ReportAgent.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<AnalysisResult> AnalysisResults { get; set; }
        public DbSet<KPI> KPIs { get; set; }
        public DbSet<Trend> Trends { get; set; }
        public DbSet<ActionItem> ActionItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure table names to match PostgreSQL lowercase convention
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Report>().ToTable("reports");
            modelBuilder.Entity<AnalysisResult>().ToTable("analysisresults");
            modelBuilder.Entity<KPI>().ToTable("kpis");
            modelBuilder.Entity<Trend>().ToTable("trends");
            modelBuilder.Entity<ActionItem>().ToTable("actionitems");

            // Configure column names to match PostgreSQL lowercase convention
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PasswordHash).HasColumnName("passwordhash");
                entity.Property(e => e.FirstName).HasColumnName("firstname");
                entity.Property(e => e.LastName).HasColumnName("lastname");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FileName).HasColumnName("filename");
                entity.Property(e => e.OriginalFileName).HasColumnName("originalfilename");
                entity.Property(e => e.FileType).HasColumnName("filetype");
                entity.Property(e => e.FilePath).HasColumnName("filepath");
                entity.Property(e => e.FileSize).HasColumnName("filesize");
                entity.Property(e => e.UserId).HasColumnName("userid");
                entity.Property(e => e.UploadedAt).HasColumnName("uploadedat");
                entity.Property(e => e.IsAnalyzed).HasColumnName("isanalyzed");
            });

            modelBuilder.Entity<AnalysisResult>(entity =>
            {
                entity.ToTable("analysisresults");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ReportId).HasColumnName("reportid");
                entity.Property(e => e.Summary).HasColumnName("summary");
                entity.Property(e => e.InsightsJson).HasColumnName("insightsjson");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            });

            modelBuilder.Entity<KPI>(entity =>
            {
                entity.ToTable("kpis");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ReportId).HasColumnName("reportid");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Value).HasColumnName("value");
                entity.Property(e => e.Unit).HasColumnName("unit");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            });

            modelBuilder.Entity<Trend>(entity =>
            {
                entity.ToTable("trends");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ReportId).HasColumnName("reportid");
                entity.Property(e => e.MetricName).HasColumnName("metricname");
                entity.Property(e => e.Direction).HasColumnName("direction");
                entity.Property(e => e.ChangePercentage).HasColumnName("changepercentage");
                entity.Property(e => e.TimeFrame).HasColumnName("timeframe");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            });

            modelBuilder.Entity<ActionItem>(entity =>
            {
                entity.ToTable("actionitems");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ReportId).HasColumnName("reportid");
                entity.Property(e => e.Title).HasColumnName("title");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Priority).HasColumnName("priority");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
            });

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Report>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<AnalysisResult>()
                .HasOne(a => a.Report)
                .WithMany(r => r.AnalysisResults)
                .HasForeignKey(a => a.ReportId);

            modelBuilder.Entity<KPI>()
                .HasOne(k => k.Report)
                .WithMany(r => r.KPIs)
                .HasForeignKey(k => k.ReportId);

            modelBuilder.Entity<Trend>()
                .HasOne(t => t.Report)
                .WithMany(r => r.Trends)
                .HasForeignKey(t => t.ReportId);

            modelBuilder.Entity<ActionItem>()
                .HasOne(a => a.Report)
                .WithMany(r => r.ActionItems)
                .HasForeignKey(a => a.ReportId);
        }
    }
}