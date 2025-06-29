import { createContext, useState, useContext } from 'react';
import TaskModal from '../components/TaskModal';
import { useUsers } from '../context/UsersContext';

const CreateContext = createContext(null);

export const CreateProvider = ({ children }) => {
    const { users=[] } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: []
    });

    const handleCreateClick = () => {
        setSelectedTask(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        console.log('CreateContext - handleSaveTask called with:', updatedTask);
        console.log('CreateContext - parentTask value:', updatedTask.parentTask);
        
        setTasks((prevTasks) => {
            // Remove the task from all status arrays (in case of edit)
            const newTasks = {
                todo: prevTasks.todo.filter(t => t.taskId !== updatedTask.taskId),
                inProgress: prevTasks.inProgress.filter(t => t.taskId !== updatedTask.taskId),
                done: prevTasks.done.filter(t => t.taskId !== updatedTask.taskId),
            };
            
            // Create a fully updated task object with all the new data
            const fullyUpdatedTask = {
                ...updatedTask,
                // Ensure all fields are preserved from the form
                taskName: updatedTask.taskName,
                description: updatedTask.description,
                priority: updatedTask.priority,
                status: updatedTask.status,
                dueDate: updatedTask.dueDate,
                projectId: updatedTask.projectId,
                orgName: updatedTask.orgName,
                parentTask: updatedTask.parentTask,
                createdBy: updatedTask.createdBy,
                assignedTo: updatedTask.assignedTo,
                creationDate: updatedTask.creationDate,
                taskId: updatedTask.taskId
            };
            
            console.log('CreateContext - fullyUpdatedTask:', fullyUpdatedTask);
            
            // Add the fully updated task to the correct status array
            if (updatedTask.status === 'todo') newTasks.todo.push(fullyUpdatedTask);
            else if (updatedTask.status === 'inProgress') newTasks.inProgress.push(fullyUpdatedTask);
            else if (updatedTask.status === 'done') newTasks.done.push(fullyUpdatedTask);
            
            return newTasks;
        });
        setIsModalOpen(false);
        setSelectedTask(null);
        setModalMode('create');
    };

    return (
        <CreateContext.Provider value={{
            handleCreateClick,
            handleEditClick,
            tasks,
            setTasks
        }}>
            {children}
            <TaskModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                    setModalMode('create');
                }}
                onSave={handleSaveTask}
                task={selectedTask}
                users={users}
                tasks={(() => {
                    const allTasks = Object.values(tasks).flat();
                    console.log('CreateContext - Tasks being passed to TaskModal:', allTasks);
                    return allTasks;
                })()}
                mode={modalMode}
            />
        </CreateContext.Provider>
    );
};

export const useCreate = () => {
    const context = useContext(CreateContext);
    if (!context) {
        throw new Error('useCreate must be used within a CreateProvider');
    }
    return context;
}; 