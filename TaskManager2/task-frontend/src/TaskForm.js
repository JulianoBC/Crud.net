import React from 'react';

function TaskForm({ 
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  handleCreateTask 
}) {

  const handleCreateTaskWithValidation = (e) => {
    e.preventDefault(); 

    if (newTaskTitle.length > 100) {
      alert("O Título não pode ter mais de 100 caracteres.");
      return; 
    }

    handleCreateTask(e);
  };


  return (
    <>
      <form onSubmit={handleCreateTaskWithValidation}>
        <div className="task-form">
          <h2>Criar Nova Tarefa</h2>
          <input 
            type="text" 
            placeholder="Título da Tarefa" 
            value={newTaskTitle} 
            onChange={e => setNewTaskTitle(e.target.value)} 
          />
          <textarea 
            placeholder="Descrição" 
            value={newTaskDescription} 
            onChange={e => setNewTaskDescription(e.target.value)} 
          />
          <button className="button" type="submit">Criar Tarefa</button>
        </div>
      </form>
    </>
  );
}

export default TaskForm;