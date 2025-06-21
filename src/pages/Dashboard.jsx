import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    LinearProgress,
    Chip,
    Avatar,
    Tooltip
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
    const { isSidebarOpen } = useSidebar();
    const userId = user.sub;

    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();


    const fetchUserTasks = async () => {
        if (!userId) return;
    
        try {
            const response = await fetch(`${usersTasksApiUrl}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response:', response);
            const result = await response.json();
            console.log('Result:', result);
    
            const tasksByStatus = { todo: [], inProgress: [], done: [] };
            result.forEach(task => {
                const status = task.status?.toLowerCase();
                if (status === 'todo') tasksByStatus.todo.push(task);
                else if (status === 'inprogress') tasksByStatus.inProgress.push(task);
                else if (status === 'done') tasksByStatus.done.push(task);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'todo': return '#ff9800';
            case 'inProgress': return '#2196f3';
            case 'done': return '#4caf50';
            default: return '#757575';
        }
    };

    const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];

    const renderColumn = (title, taskList, status) => (
        <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            minWidth: 0 // Prevents flex items from overflowing
        }}>
            <Paper sx={{ 
                p: 3, 
                minHeight: '600px', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                backgroundColor: '#ffffff',
                border: `2px solid ${getStatusColor(status)}20`
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 2,
                    borderBottom: `3px solid ${getStatusColor(status)}`
                }}>
                    <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: getStatusColor(status),
                        mr: 2
                    }} />
                    <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50'
                    }}>
                        {title} ({taskList.length})
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                    }
                }}>
                    {taskList.map((task) => (
                        <Card key={task.taskId} sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        fontSize: '1rem',
                                        lineHeight: 1.3
                                    }}>
                                        {task.taskName}
                                    </Typography>
                                    <Tooltip title="Edit Task">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleEditTask(task)}
                                            sx={{
                                                color: '#6c757d',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2'
                                                }
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                    mb: 2,
                                    lineHeight: 1.5,
                                    color: '#6c757d'
                                }}>
                                    {task.description}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    <Chip 
                                        label={task.priority} 
                                        size="small"
                                        sx={{ 
                                            backgroundColor: getPriorityColor(task.priority), 
                                            color: 'white',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }} 
                                    />
                                    <Chip 
                                        label={task.status} 
                                        size="small"
                                        sx={{ 
                                            backgroundColor: getStatusColor(task.status), 
                                            color: 'white',
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            textTransform: 'capitalize'
                                        }} 
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    <Typography variant="caption" sx={{ 
                                        color: '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        📅 {dayjs(task.creationDate).format('MMM DD')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ 
                                        color: '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        ⏰ {dayjs(task.dueDate).format('MMM DD')}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Progress
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {getProgress(task.status)}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={getProgress(task.status)} 
                                        sx={{ 
                                            height: 6, 
                                            borderRadius: 3,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 3,
                                                background: `linear-gradient(90deg, ${getStatusColor(task.status)} 0%, ${getStatusColor(task.status)}80 100%)`
                                            }
                                        }} 
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {taskList.length === 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: 200,
                            color: '#9e9e9e'
                        }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                No tasks in this column
                            </Typography>
                            <Typography variant="caption">
                                Tasks will appear here when added
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f8f9fa' }}>
                <Sidebar />
                <Box sx={{ 
                    flex: 1, 
                    p: 3, 
                    overflow: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                }}>
                    <Container maxWidth={false} sx={{ 
                        mt: 2, 
                        mb: 4,
                        px: 0 // Remove default padding to allow full width
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 4,
                            pb: 2,
                            borderBottom: '2px solid #e9ecef'
                        }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700,
                                color: '#2c3e50',
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                Frontend Team Dashboard
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: '#6c757d',
                                backgroundColor: '#e9ecef',
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                fontWeight: 500
                            }}>
                                {allTasks.length} Total Tasks
                            </Typography>
                        </Box>
                        
                        <Grid container spacing={3} alignItems="flex-start" sx={{ 
                            minHeight: 'calc(100vh - 200px)',
                            '& .MuiGrid-item': {
                                minWidth: 0 // Prevents grid items from overflowing
                            }
                        }}>
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
