import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useUsers } from '../context/UsersContext';
import { useCreate } from '../context/CreateContext';
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
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import config from '../config';

// // Dummy users list (can be replaced with dynamic org-based members)
// const users = [
//     { id: '1', name: 'Alice' },
//     { id: '2', name: 'Bob' },
//     { id: '3', name: 'Charlie' }
// ];


// Initial empty task structure
const initialTasks = { todo: [], inProgress: [], done: [] };

function Dashboard() {
    const { users } = useUsers();
    const usersTasksApiUrl = config.apiBaseUrl + config.endpoints.tasksUser;
    const { user } = useAuth();
    const { isSidebarOpen } = useSidebar();
    const userId = user.sub;
    const { tasks, setTasks, handleCreateClick, handleEditClick } = useCreate();
    const navigate = useNavigate();
    const [expandedColumns, setExpandedColumns] = useState({ todo: false, inProgress: false, done: false });

    // Fetch tasks for the current user
    useEffect(() => {
        const fetchUserTasks = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`${usersTasksApiUrl}?userId=${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                console.log('Dashboard - Raw tasks from API:', result);
                
                const tasksByStatus = { todo: [], inProgress: [], done: [] };
                result.forEach(task => {
                    // Debug each task's creation date
                    console.log(`Dashboard - Task ${task.taskName} creationDate:`, task.creationDate);
                    console.log(`Dashboard - Task ${task.taskName} full object:`, task);
                    console.log(`Dashboard - Task ${task.taskName} status:`, task.status);
                    
                    const status = task.status?.toLowerCase();
                    console.log(`Dashboard - Task ${task.taskName} processed status:`, status);
                    
                    if (status === 'todo') tasksByStatus.todo.push(task);
                    else if (status === 'inprogress' || status === 'in progress') tasksByStatus.inProgress.push(task);
                    else if (status === 'done') tasksByStatus.done.push(task);
                    else {
                        console.log(`Dashboard - Task ${task.taskName} with status '${status}' not categorized`);
                    }
                });
                setTasks(tasksByStatus);
            } catch (error) {
                console.error('Error fetching user tasks:', error);
            }
        };
        fetchUserTasks();
    }, [userId, setTasks, usersTasksApiUrl]);

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

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'todo': return 'To do';
            case 'inProgress': return 'In progress';
            case 'done': return 'Done';
            default: return status;
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

    // Helper function to get the correct creation date from task object
    const getCreationDate = (task) => {
        // Check for various possible field names for creation date
        const possibleFields = ['creationDate', 'createdAt', 'created_date', 'createdDate', 'dateCreated'];
        for (const field of possibleFields) {
            if (task[field]) {
                console.log(`Dashboard - Found creation date in field '${field}':`, task[field]);
                return task[field];
            }
        }
        console.log(`Dashboard - No creation date found for task ${task.taskName}, available fields:`, Object.keys(task));
        return null;
    };

    const handleToggleExpand = (status) => {
        setExpandedColumns(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const renderColumn = (title, taskList, status) => {
        const isExpanded = expandedColumns[status];
        const visibleTasks = isExpanded ? taskList : taskList.slice(0, 2);
        return (
            <Grid item xs={12} md={4} sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0
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
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '3px' },
                        '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '3px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: '#a8a8a8' }
                    }}>
                        {visibleTasks.map((task) => {
                            console.log(`Dashboard - Rendering card for task ${task.taskName}:`, {
                                taskId: task.taskId,
                                creationDate: task.creationDate,
                                dueDate: task.dueDate
                            });
                            
                            return (
                            <Card key={task.taskId} sx={{
                                mb: 2,
                                mt: 1,
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0',
                                transition: 'all 0.3s ease-in-out',
                                backgroundColor: '#ffffff',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    borderColor: getStatusColor(status),
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            lineHeight: 1.4,
                                            flex: 1,
                                            mr: 1
                                        }}>
                                            {task.taskName}
                                        </Typography>
                                        <Tooltip title="Edit Task">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(task)}
                                                sx={{
                                                    color: '#6c757d',
                                                    backgroundColor: '#f8f9fa',
                                                    '&:hover': {
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        mb: 3,
                                        lineHeight: 1.6,
                                        color: '#5a6c7d',
                                        fontSize: '0.9rem'
                                    }}>
                                        {task.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                backgroundColor: getPriorityColor(task.priority),
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                height: 24,
                                                '& .MuiChip-label': { px: 1.5 }
                                            }}
                                        />
                                        <Chip
                                            label={getStatusDisplay(task.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: getStatusColor(task.status),
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                height: 24,
                                                '& .MuiChip-label': { px: 1.5 }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mb: 3,
                                        flexWrap: 'wrap',
                                        p: 1.5,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <Typography variant="caption" sx={{
                                            color: '#495057',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}>
                                            📅 Created: {getCreationDate(task) ? dayjs(getCreationDate(task)).format('MMM DD, YYYY') : 'N/A'}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: '#495057',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}>
                                            ⏰ Due: {task.dueDate ? dayjs(task.dueDate).format('MMM DD, YYYY') : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" sx={{
                                                color: '#6c757d',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}>
                                                Progress
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: '#6c757d',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}>
                                                {getProgress(task.status)}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={getProgress(task.status)}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: '#e9ecef',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    background: `linear-gradient(90deg, ${getStatusColor(task.status)} 0%, ${getStatusColor(task.status)}80 100%)`,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                        {taskList.length > 2 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <button
                                    onClick={() => handleToggleExpand(status)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#1976d2',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        padding: 0,
                                        textDecoration: 'underline',
                                    }}
                                >
                                    {isExpanded ? 'See less' : `See more (${taskList.length - 2})`}
                                </button>
                            </Box>
                        )}
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
    };

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
                        px: 0
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
                                minWidth: 0
                            }
                        }}>
                            {renderColumn('To Do', tasks.todo, 'todo')}
                            {renderColumn('In Progress', tasks.inProgress, 'inProgress')}
                            {renderColumn('Done', tasks.done, 'done')}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
