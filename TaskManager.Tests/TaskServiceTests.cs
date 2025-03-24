using TaskManager.Application.Services;
using TaskManager.Infrastructure.Interfaces;
using Moq;
using Xunit;
using TaskManager.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace TaskManager.Tests
{
    public class TaskServiceTests
    {
        private readonly Mock<ITaskRepository> _mockTaskRepository;
        private readonly TaskService _taskService;

        public TaskServiceTests()
        {
            _mockTaskRepository = new Mock<ITaskRepository>();
            _taskService = new TaskService(_mockTaskRepository.Object);
        }

        [Fact]
        public async Task CreateTaskAsync_ValidTask_ReturnsCreatedTask()
        {
            // Arrange
            var taskToCreate = new TaskManager.Domain.Entities.TaskItem { Title = "Test Task", Description = "Test Description", Status = TaskManager.Domain.Entities.TaskStatus.Pending };
            var createdTask = new TaskManager.Domain.Entities.TaskItem { Id = 1, Title = "Test Task", Description = "Test Description", Status = TaskManager.Domain.Entities.TaskStatus.Pending, CreationDate = DateTime.UtcNow };
            _mockTaskRepository.Setup(repo => repo.AddAsync(taskToCreate)).ReturnsAsync(1);
            _mockTaskRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(createdTask);

            // Act
            var result = await _taskService.CreateTaskAsync(taskToCreate);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Test Task", result.Title);
        }

        [Fact]
        public async Task CreateTaskAsync_InvalidTask_ThrowsException()
        {
            // Arrange
            var invalidTask = new TaskManager.Domain.Entities.TaskItem { Title = "", Description = "Test Description", Status = TaskManager.Domain.Entities.TaskStatus.Pending };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _taskService.CreateTaskAsync(invalidTask));
        }

        [Fact]
        public void ValidateTask_ThrowsException_ForInvalidTitle()
        {
            var task = new TaskManager.Domain.Entities.TaskItem { Title = "" };
            var exception = Assert.Throws<ArgumentException>(() => task.Validate());
            Assert.Equal("O título deve ter entre 1 e 100 caracteres.", exception.Message);
        }
    }
}