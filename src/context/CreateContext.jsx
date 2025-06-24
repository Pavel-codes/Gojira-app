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

    const handleCreateClick = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        console.log("updatedTask details: ",updatedTask);
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks, ...updatedTask };
    
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