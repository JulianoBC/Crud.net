using TaskManager.Domain.Entities;
using System.Threading.Tasks;

namespace TaskManager.Application.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskManager.Domain.Entities.TaskItem>> GetAllTasksAsync();
        Task<TaskManager.Domain.Entities.TaskItem> GetTaskByIdAsync(int id);
        Task<TaskManager.Domain.Entities.TaskItem> CreateTaskAsync(TaskManager.Domain.Entities.TaskItem task);
        System.Threading.Tasks.Task UpdateTaskAsync(TaskManager.Domain.Entities.TaskItem task);
        System.Threading.Tasks.Task DeleteTaskAsync(int id);
    }
}