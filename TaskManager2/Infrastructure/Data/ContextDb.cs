using Microsoft.EntityFrameworkCore;
using TaskItem = TaskManager.Domain.Entities.TaskItem;

namespace TaskManager.Infrastructure.Data
{
    public class TaskManagerContext : DbContext
    {
        public TaskManagerContext(DbContextOptions<TaskManagerContext> options) : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>().ToTable("Tasks");
            base.OnModelCreating(modelBuilder); // Ensure base implementation is called
        }
    }
}