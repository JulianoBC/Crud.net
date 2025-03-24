using System.ComponentModel.DataAnnotations;

namespace TaskManager.Domain.Entities
{
    public enum TaskStatus
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ConclusionDate { get; set; }

        public TaskStatus Status { get; set; }

        public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Title) || Title.Length > 100)
            throw new ArgumentException("O título deve ter entre 1 e 100 caracteres.");

        if (ConclusionDate.HasValue && ConclusionDate.Value < CreationDate)
            throw new ArgumentException("A data de conclusão não pode ser anterior à data de criação.");
    }
        public TaskItem()
        {
            Title = string.Empty;
        }
    }
}