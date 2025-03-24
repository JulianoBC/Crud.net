using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace TaskManager.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<TaskManager.Domain.Entities.TaskItem> CreateTaskAsync(TaskManager.Domain.Entities.TaskItem task)
        {
            ValidateTaskTitleForCreation(task.Title); 

            if (task.ConclusionDate.HasValue && task.ConclusionDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Conclusion Date cannot be before Creation Date.");
            }

            task.CreationDate = DateTime.UtcNow;
            var createdTaskId = await _taskRepository.AddAsync(task);
            return await _taskRepository.GetByIdAsync(createdTaskId);
        }

        private void ValidateTaskTitleForCreation(string title) 
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException("Title is required.");
            }
            if (title.Length > 100)
            {
                throw new ArgumentException("Title cannot be longer than 100 characters.");
            }
        }

        public System.Threading.Tasks.Task DeleteTaskAsync(int id)
        {
            return _taskRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<TaskManager.Domain.Entities.TaskItem>> GetAllTasksAsync()
        {
            return await _taskRepository.GetAllAsync();
        }

        public async Task<TaskManager.Domain.Entities.TaskItem> GetTaskByIdAsync(int id)
        {
            return await _taskRepository.GetByIdAsync(id);
        }

        public System.Threading.Tasks.Task UpdateTaskAsync(TaskManager.Domain.Entities.TaskItem task)
        {
            var existingTask = _taskRepository.GetByIdAsync(task.Id).Result;
            ValidateTaskForUpdate(task);
            
            Console.WriteLine($"Task Status before update: {existingTask?.Status}"); // Log existing status
            Console.WriteLine($"Updated Task Status: {task.Status}"); // Log updated status
            Console.WriteLine($"Checking condition: task.Status == Completed: {task.Status == Domain.Entities.TaskStatus.Completed}, existingTask?.Status != Completed: {existingTask?.Status != Domain.Entities.TaskStatus.Completed}");

            if (task.Status == Domain.Entities.TaskStatus.Completed && existingTask?.Status != Domain.Entities.TaskStatus.Completed)
            {
                Console.WriteLine($"Condition is true.");
                Console.WriteLine("Status changed to Completed. Setting ConclusionDate."); // Log message
                Console.WriteLine($"DateTime.UtcNow: {DateTime.UtcNow}"); // Log DateTime.UtcNow
                task.ConclusionDate = DateTime.UtcNow;
                Console.WriteLine($"task.ConclusionDate after set: {task.ConclusionDate}"); // Log task.ConclusionDate after setting
            } else {
                Console.WriteLine($"Condition is false.");
                Console.WriteLine("Status not changed to Completed or already Completed."); // Log message
                if (task.Status == Domain.Entities.TaskStatus.Completed) {
                    Console.WriteLine($"Existing task status was already Completed."); // Log existing task status was already Completed
                    Console.WriteLine($"Existing task status was already: {existingTask?.Status}"); // Log existing status if already completed
                }
            }
            return _taskRepository.UpdateAsync(task);
        }

        private void ValidateTaskForUpdate(TaskManager.Domain.Entities.TaskItem task)
        {
            if (string.IsNullOrEmpty(task.Title))
            {
                throw new ArgumentException("Title is required.");
            }
            if (task.Title.Length > 100)
            {
                throw new ArgumentException("Title cannot be longer than 100 characters.");
            }
            if (task.ConclusionDate.HasValue && task.ConclusionDate < task.CreationDate)
            {
                throw new ArgumentException("Conclusion Date cannot be before Creation Date.");
            }
        }
    }
}