import { createContext, useState, useContext } from 'react';
import TaskModal from '../components/TaskModal';

const CreateContext = createContext(null);

export const CreateProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: []
    });

    const handleCreateClick = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            if (selectedTask) {
                const oldStatus = selectedTask.status;
                newTasks[oldStatus] = newTasks[oldStatus].filter(t => t.id !== selectedTask.id);
            }
            const newStatus = updatedTask.status;
            const taskToAdd = {
                ...updatedTask,
                id: selectedTask ? selectedTask.id : Date.now(),
                status: newStatus,
                creationDate: selectedTask ? (selectedTask.creationDate || new Date().toISOString()) : new Date().toISOString(),
                dueDate: updatedTask.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
            newTasks[newStatus] = [...newTasks[newStatus], taskToAdd];
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
                users={[
                    { id: '1', name: 'Alice' },
                    { id: '2', name: 'Bob' },
                    { id: '3', name: 'Charlie' },
                ]}
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