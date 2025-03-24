using TaskManager.Domain.Entities;
using System.Threading.Tasks;

namespace TaskManager.Infrastructure.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskManager.Domain.Entities.TaskItem>> GetAllAsync();
        Task<TaskManager.Domain.Entities.TaskItem> GetByIdAsync(int id);
        Task<int> AddAsync(TaskManager.Domain.Entities.TaskItem task);
        Task<int> UpdateAsync(TaskManager.Domain.Entities.TaskItem task);
        Task<int> DeleteAsync(int id);
    }
}