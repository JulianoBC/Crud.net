import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

function App() {
    const [tasks, setTasks] = useState([]);
    
    const [filterStatus, setFilterStatus] = useState('Todas');
    const statusMap = {
      0: "Pendente",
      1: "Em Progresso",
      2: "Concluída",
    };
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [editTaskStatus, setEditTaskStatus] = useState(0);
    const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:5289/api/tasks');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Could not fetch tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    const setupEditTask = (task) => {
      setEditingTaskId(task.id);
      setEditTaskTitle(task.title);
      setEditTaskDescription(task.description);
      setEditTaskStatus(task.status);
      setShowTaskForm(false); 
    };

    const updateTask = (updatedTask) => {
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    };
    
  
    const handleCancelEdit = () => {
      setEditingTaskId(null);
    };


    const handleSaveEdit = async (e) => {
      console.log("handleSaveEdit function called!"); 
      if (!editTaskTitle.trim()) {
        alert("Título nao pode ser vazio.");
        return;
      }

      try {
        
        console.log("Fetch Request:", {
          url: `http://localhost:5289/api/tasks/${editingTaskId}`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: editingTaskId, 
            status: parseInt(editTaskStatus, 10), 
            title: editTaskTitle, 
            description: editTaskDescription, 
            conclusionDate: null 
          }),
        });
        let conclusionDate = null;
        if (parseInt(editTaskStatus, 10) === 2) { 
          conclusionDate = new Date().toISOString();
        }
        const response = await fetch(`http://localhost:5289/api/tasks/${editingTaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: editingTaskId, 
            status: parseInt(editTaskStatus, 10), 
            title: editTaskTitle, 
            description: editTaskDescription,
            conclusionDate: conclusionDate 
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedTask = await response.json(); 
        setTasks(tasks.map(task => {
          if (task.id === editingTaskId) {
            return {...task, ...updatedTask};
          } else {
            return task;
          }
        }));
        setEditingTaskId(null);
        alert("Tarefa atualizada com sucesso"); 
      } catch (error) {
        console.error("Could not update task:", error);
      }
    };


    const handleDeleteTask = async (taskId) => {
      try {
        const response = await fetch(`http://localhost:5289/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setTasks(tasks.filter(task => task.id !== taskId));
        alert("Task deleted successfully!"); // Provide user feedback

      } catch (error) {
        console.error("Could not delete task:", error);
      }
    };


    const handleCreateTask = async (e) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) {
        alert("Title cannot be empty");
        return;
      }

      try {
        const response = await fetch('http://localhost:5289/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription, status: 0 }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setShowTaskForm(false); // Close new task form after creating task
      } catch (error) {
        console.error("Could not create task:", error);
      }
    };
    const getTaskById = async (taskId) => {
      try {
        console.log("getTaskById called for taskId:", taskId); // Log when getTaskById is called
        const response = await fetch(`http://localhost:5289/api/tasks/${taskId}`);
        console.log("getTaskById response:", response); // Log response object
        if (!response.ok) {
          if (response.status === 404) {
            alert(`Task with ID ${taskId} not found.`);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        const task = await response.json();
        console.log("getTaskById fetched task:", task); // Log fetched task
        return task; // Return the task here
      } catch (error) {
        console.error("Could not fetch task by ID:", error);
        return null; // Return null in case of error
      }
    };


    return (
        <div className="App">
          <div style={{ position: 'relative' }}> {/* Container for button and form */}
            <button
              className="button create-task-button"
              onClick={() => {
                  console.log('showTaskForm state before set:', showTaskForm);
                  setShowTaskForm(!showTaskForm);
                  console.log('showTaskForm state after set:', !showTaskForm);
                }}
            >
              {showTaskForm ? "Esconder o Form de nova Tarefa" : "Criar nova tarefa"}
            </button>
            <h1>TAREFAS</h1>

          <div className="filter-tabs">
            <button 
              className={`tab-button${filterStatus === 'All' ? 'active' : 'active'}`}
              onClick={() => setFilterStatus('Todas')}
            >TODAS</button>
            <button 
              className={`tab_button${filterStatus === 'Pendente' ? 'active' : 'active'}`}
              onClick={() => setFilterStatus('Pendente')}
            >PENDENTE</button>
            <button 
              className={`tab_button${filterStatus === 'Em Progresso' ? 'active' : 'active'}`}
              onClick={() => setFilterStatus('Em Progresso')}
            >EM PROGRESSO</button>
            <button 
              className={`tab-button${filterStatus === 'CONCLUÍDA' ? 'active' : 'active'}`}
              onClick={() => setFilterStatus('Concluída')}
            >CONCLUÍDA</button>
          </div>

          
            {/* Conditionally render Create Task Form - only when NOT editing */}
            {!editingTaskId && showTaskForm && (
              
                // New Task Form
                <TaskForm 
                  newTaskTitle={newTaskTitle} setNewTaskTitle={setNewTaskTitle}
                  newTaskDescription={newTaskDescription}
                  setNewTaskDescription={setNewTaskDescription}
                  handleCreateTask={handleCreateTask}
                />
              
            )}
          </div>

          {/* Edit Task Form */}


            <TaskList 
              tasks={tasks} 
              statusMap={statusMap}
              filterStatus={filterStatus}
              setupEditTask={setupEditTask}
              updateTask={updateTask}
              handleDeleteTask={handleDeleteTask}
              getTaskById={getTaskById} // Pass getTaskById prop
            />
          </div>
        
    );
}

export default App;