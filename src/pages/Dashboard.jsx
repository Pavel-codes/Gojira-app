import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TaskModal from '../components/TaskModal';

const initialTasks = {
    todo: [
        { id: 1, title: 'Setup AWS Cognito', priority: 'High', description: 'Configure authentication', status: 'todo' },
        { id: 2, title: 'Design Database Schema', priority: 'Medium', description: 'Create ERD', status: 'todo' },
    ],
    inProgress: [
        { id: 3, title: 'Implement Login Flow', priority: 'High', description: 'Connect to Cognito', status: 'inProgress' },
    ],
    done: [
        { id: 4, title: 'Project Setup', priority: 'Low', description: 'Initialize React project', status: 'done' },
    ],
};

function Dashboard() {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };

            // If editing existing task
            if (selectedTask) {
                // Remove from old status
                const oldStatus = selectedTask.status;
                newTasks[oldStatus] = newTasks[oldStatus].filter(t => t.id !== selectedTask.id);
            }

            // Add to new status
            const newStatus = updatedTask.status;
            const taskToAdd = {
                ...updatedTask,
                id: selectedTask ? selectedTask.id : Date.now(),
                status: newStatus
            };

            newTasks[newStatus] = [...newTasks[newStatus], taskToAdd];
            return newTasks;
        });
        setIsModalOpen(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical':
                return '#d32f2f';
            case 'High':
                return '#f57c00';
            case 'Medium':
                return '#1976d2';
            case 'Low':
                return '#388e3c';
            default:
                return '#757575';
        }
    };

    const renderColumn = (title, tasks, status) => (
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                {tasks.map((task) => (
                    <Card key={task.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" component="div">
                                    {task.title}
                                </Typography>
                                <IconButton size="small" onClick={() => handleEditTask(task)}>
                                    <EditIcon />
                                </IconButton>
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                {task.description}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    backgroundColor: getPriorityColor(task.priority),
                                    color: 'white',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                }}
                            >
                                {task.priority}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Paper>
        </Grid>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">Gojira Dashboard</Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddTask}
                        sx={{ mr: 2 }}
                    >
                        Add Task
                    </Button>
                    <Button variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {renderColumn('To Do', tasks.todo, 'todo')}
                {renderColumn('In Progress', tasks.inProgress, 'inProgress')}
                {renderColumn('Done', tasks.done, 'done')}
            </Grid>

            <TaskModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={selectedTask}
            />
        </Container>
    );
}

export default Dashboard; 