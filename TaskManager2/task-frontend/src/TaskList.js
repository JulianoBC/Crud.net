import React, { useState } from 'react';
import TaskDetailsModal from './TaskDetailsModal'; 

function TaskList({ tasks, statusMap, filterStatus, setupEditTask, updateTask, handleDeleteTask, getTaskById, searchIdFilter,
  handleSaveEditWithValidation 
}) {
  const filteredTasks = tasks.filter(task => {
    if (searchIdFilter && (!Number.isNaN(parseInt(searchIdFilter, 10)) && task.id !== parseInt(searchIdFilter, 10))) { 
      return false;
    }
    if (filterStatus !== 'Todas' && statusMap[task.status] !== filterStatus) { 
      return false;
    }
    return true;
  });

  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localEditingTaskId, setLocalEditingTaskId] = useState(null);
  const [localEditTaskTitle, setLocalEditTaskTitle] = useState('');
  const [localEditTaskDescription, setLocalEditTaskDescription] = useState('');
  const [localEditTaskStatus, setLocalEditTaskStatus] = useState(0);

  const handleLocalEditClick = (task) => {
    console.log("handleLocalEditClick called for taskId:", task.id); 
    setLocalEditingTaskId(task.id);
    setLocalEditTaskTitle(task.title);
    setLocalEditTaskDescription(task.description);
    setLocalEditTaskStatus(task.status);
  };

  const handleLocalCancelEdit = () => {
    console.log("handleLocalCancelEdit called"); 
    setLocalEditingTaskId(null);
  };

  
  const handleLocalSaveEditWithValidation = (e) => {
    e.preventDefault(); 

    if (localEditTaskTitle.length > 100) {
      alert("O Título não pode ter mais de 100 caracteres.");
      return; 
    }

    handleLocalSaveEdit(e); 
  };

  const handleLocalSaveEdit = async (e) => {
    e.preventDefault(); 
  
    
    if (!localEditTaskTitle.trim()) {
      alert("Título não pode estar em branco.");
      return;
    }
  
    
    if (!localEditingTaskId) {
      alert("ID da tarefa não pode ser encontrado.");
      return;
    }
  
    try {
      
      const parsedStatus = parseInt(localEditTaskStatus, 10);
      if (isNaN(parsedStatus)) {
        alert("Status inválido.");
        return;
      }
  
      
      console.log("Sending updated task data:", {
        id: localEditingTaskId,
        title: localEditTaskTitle,
        description: localEditTaskDescription,
        status: parsedStatus,
      });
  
      
      const response = await fetch(`http://localhost:5289/api/tasks/${localEditingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: localEditingTaskId,
          title: localEditTaskTitle,
          description: localEditTaskDescription,
          status: parsedStatus,
        }),
      });
  
      
      if (!response.ok) {
        const responseBody = await response.text(); 
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${responseBody}`);
      }
  
      
      const updatedTask = await response.json();
      console.log("Tarefa foi editada com sucesso:", updatedTask);
  
      
      const taskIndex = tasks.findIndex(task => task.id === localEditingTaskId);
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;
       

        updateTask(updatedTask); 
      }
      setLocalEditingTaskId(null); 
      
      alert("Tarefa editada com sucesso!");
    } catch (error) {
      
      console.error("Error updating task:", error);
  
      
      alert(`An error occurred while updating the task: ${error.message}`);
    }
  };


  const handleViewDetailsClick = async (taskId) => {
    try {
      console.log("Fetching task details for taskId:", taskId); 
      const taskDetails = await getTaskById(taskId); 
      setSelectedTask(taskDetails); 
      setIsModalOpen(true);
    } catch (error) {
      console.error("Could not fetch task details:", error);
      alert("Could not fetch task details. Please try again later.");
    }
  };

  return (
    <>
      <ul>
      {filteredTasks.map(task => (
          <li className="task-item" key={task.id}>
            {localEditingTaskId === task.id ? (
              <form onSubmit={(e) => handleLocalSaveEditWithValidation(e)}> {}
                <input
                  type="text"
                  value={localEditTaskTitle}
                  onChange={e => {
                    setLocalEditTaskTitle(e.target.value)
                    console.log("localEditTaskTitle:", localEditTaskTitle);

                    if (!localEditingTaskId) {
                      alert("ID da tarefa está faltando ou inválido.");
                      return;
                  }
                  }}
                />
                <textarea
                  value={localEditTaskDescription}
                  onChange={e => setLocalEditTaskDescription(e.target.value)}
                />
                <select
                  value={localEditTaskStatus}
                  onChange={e => setLocalEditTaskStatus(parseInt(e.target.value, 10))}
                >
                  <option value={0}>Pendente</option>
                  <option value={1}>Em Progresso</option>
                  <option value={2}>Concluída</option>
                </select>
                <div className="task-actions">
                  <button className="button" type="submit">Salvar</button>
                  <button className="button" type="button" onClick={handleLocalCancelEdit} style={{ backgroundColor: '#6c757d' }}>Cancelar</button>
                </div>
              </form>
            ) : (
              <div>
                <h3>Título da tarefa: {task.title}</h3>
                <p>Descrição da tarefa: {task.description}</p>
                <p>ID: {task.id}</p>
                <p>Status: {statusMap[task.status]}</p>
                <div className="task-actions">
                  <button className="button" onClick={() => handleLocalEditClick(task)}>Editar</button> {}
                  <button className="button" onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#e53e3e' }}>Deletar</button>
                  <button className="button" onClick={() => handleViewDetailsClick(task.id)} style={{ backgroundColor: '#007bff' }}>Olhar Detalhes</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isModalOpen && selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default TaskList;