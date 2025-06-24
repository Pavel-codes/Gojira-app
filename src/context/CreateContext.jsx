import { createContext, useState, useContext } from 'react';
import TaskModal from '../components/TaskModal';
import { useUsers } from '../context/UsersContext';

const CreateContext = createContext(null);

export const CreateProvider = ({ children }) => {
    const { users=[] } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: []
    });

    const handleCreateClick = (task = null) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        setTasks((prevTasks) => {
            // Remove the task from all status arrays (in case of edit)
            const newTasks = {
                todo: prevTasks.todo.filter(t => t.taskId !== updatedTask.taskId),
                inProgress: prevTasks.inProgress.filter(t => t.taskId !== updatedTask.taskId),
                done: prevTasks.done.filter(t => t.taskId !== updatedTask.taskId),
            };
            // Add the task to the correct status array
            if (updatedTask.status === 'todo') newTasks.todo.push(updatedTask);
            else if (updatedTask.status === 'inProgress') newTasks.inProgress.push(updatedTask);
            else if (updatedTask.status === 'done') newTasks.done.push(updatedTask);
            return newTasks;
        });
        setIsModalOpen(false);
    };
    

    return (
        <CreateContext.Provider value={{
            handleCreateClick,
            tasks,
            setTasks
        }}>
            {children}
            <TaskModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={selectedTask}
                users={users}
                tasks={Object.values(tasks).flat()}
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