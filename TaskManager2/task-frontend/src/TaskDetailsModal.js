import React from 'react';
import './TaskDetailsModal.css'; // Import CSS for modal

function TaskDetailsModal({ task, onClose }) {
  if (!task) {
    return null;
  }

  return (
    <div className="task-details-modal">
      <div className="task-details-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Detalhes das Tarefas</h2>
        <p><strong>ID:</strong> {task.id}</p>
        <p><strong>Título:</strong> {task.title}</p>
        <p><strong>Descrição:</strong> {task.description}</p>
        <p><strong>Data de Criação(Creation Date):</strong> {task.creationDate}</p>
        <p><strong>Data de Conclusão(Conclusion Date):</strong> {task.conclusionDate || 'N/A'}</p>
        <p><strong>Status:</strong> {task.status}</p>
      </div>
    </div>
  );
}

export default TaskDetailsModal;