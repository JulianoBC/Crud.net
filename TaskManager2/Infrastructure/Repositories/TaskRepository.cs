using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;

namespace TaskManager.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<TaskManager.Domain.Entities.TaskItem>> GetAllAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<TaskManager.Domain.Entities.TaskItem>("SELECT * FROM Tasks");
            }
        }

        public async Task<TaskManager.Domain.Entities.TaskItem> GetByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var taskItem = await connection.QueryFirstOrDefaultAsync<TaskManager.Domain.Entities.TaskItem>(
                    "SELECT * FROM Tasks WHERE Id = @Id", 
                    new { Id = id });

        if (taskItem == null)
        {
            throw new KeyNotFoundException($"Task with ID {id} not found.");
        }

        return taskItem;
            }
        }

        public async Task<int> AddAsync(TaskManager.Domain.Entities.TaskItem task)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sql = "INSERT INTO Tasks (Title, Description, CreationDate, ConclusionDate, Status) VALUES (@Title, @Description, @CreationDate, @ConclusionDate, @Status); SELECT CAST(SCOPE_IDENTITY() as int)";
                return await connection.ExecuteScalarAsync<int>(sql, new
                {
                    Title = task.Title,
                    Description = task.Description,
                    CreationDate = task.CreationDate,
                    ConclusionDate = task.ConclusionDate,
                    Status = task.Status // Save Status as integer
                });
            }
        }

        public async Task<int> UpdateAsync(TaskManager.Domain.Entities.TaskItem task)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sql = "UPDATE Tasks SET Title = @Title, Description = @Description, ConclusionDate = @ConclusionDate, Status = @Status WHERE Id = @Id";
                return await connection.ExecuteAsync(sql, new
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    ConclusionDate = task.ConclusionDate,
                    Status = task.Status // Save Status as integer
                });
            }
        }

        public async Task<int> DeleteAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.ExecuteAsync("DELETE FROM Tasks WHERE Id = @Id", new { Id = id });
            }
        }
    }
}