import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TaskModal from '../components/TaskModal';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import config from '../config';

// Dummy users list (can be replaced with dynamic org-based members)
const users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' }
];

// Initial empty task structure
const initialTasks = { todo: [], inProgress: [], done: [] };

function Dashboard() {
    const usersTasksApiUrl = config.apiBaseUrl + config.endpoints.tasksUser;
    const { user, orgName } = useAuth();
    const userId = user.sub;

    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchUserTasks = async () => {
        console.log('Fetching tasks for user:', userId);
        try {
            const response = await fetch(`${usersTasksApiUrl}?userId=${encodeURIComponent(userId)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks for user ${userId}: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched user tasks:', data);

            const tasksByStatus = { todo: [], inProgress: [], done: [] };
            data.forEach(task => {
                if (task.status === 'todo') {
                    tasksByStatus.todo.push(task);
                } else if (task.status === 'inProgress') {
                    tasksByStatus.inProgress.push(task);
                } else if (task.status === 'done') {
                    tasksByStatus.done.push(task);
                }
            });

            setTasks(tasksByStatus);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
        }
    };

    useEffect(() => {
        fetchUserTasks();
    }, []);

    const handleEditTask = (task) => {
        setSelectedTask(task);
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
            const now = dayjs();
            const taskToAdd = {
                ...updatedTask,
                id: selectedTask ? selectedTask.id : Date.now(),
                status: newStatus,
                creationDate: selectedTask?.creationDate || now.toISOString(),
                dueDate: updatedTask.dueDate || now.add(7, 'day').toISOString()
            };

            newTasks[newStatus] = [...newTasks[newStatus], taskToAdd];
            return newTasks;
        });

        setIsModalOpen(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return '#d32f2f';
            case 'High': return '#f57c00';
            case 'Medium': return '#1976d2';
            case 'Low': return '#388e3c';
            default: return '#757575';
        }
    };

    const getProgress = (status) => {
        switch (status) {
            case 'todo': return 0;
            case 'inProgress': return 50;
            case 'done': return 100;
            default: return 0;
        }
    };

    const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];

    const renderColumn = (title, taskList, status) => (
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Paper sx={{ p: 2, minHeight: '500px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                {taskList.map((task) => (
                    <Card key={task.taskId} sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6">{task.taskName}</Typography>
                                <IconButton size="small" onClick={() => handleEditTask(task)}>
                                    <EditIcon />
                                </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {task.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                <Typography variant="caption" sx={{ backgroundColor: getPriorityColor(task.priority), color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
                                    {task.priority}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Created: {dayjs(task.creationDate).format('YYYY-MM-DD')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Due: {dayjs(task.dueDate).format('YYYY-MM-DD')}
                                </Typography>
                            </Box>
                            <Box sx={{ width: '100%', mb: 1 }}>
                                <LinearProgress variant="determinate" value={getProgress(task.status)} sx={{ height: 8, borderRadius: 4 }} />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Paper>
        </Grid>
    );

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onMenuClick={toggleSidebar} />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
                <Box sx={{
                    width: sidebarOpen ? '240px' : '0',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
                    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h4">Frontend team</Typography>
                        </Box>
                        <Grid container spacing={3} alignItems="flex-start" wrap="nowrap">
                            {renderColumn('To Do', tasks.todo, 'todo')}
                            {renderColumn('In Progress', tasks.inProgress, 'inProgress')}
                            {renderColumn('Done', tasks.done, 'done')}
                        </Grid>
                        <TaskModal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSaveTask}
                            task={selectedTask}
                            users={users}
                            tasks={allTasks}
                        />
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
