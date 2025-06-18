import { useState, useEffect } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box,
    Chip, Alert, CircularProgress
} from '@mui/material';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import FlagIcon from '@mui/icons-material/Flag';
import TimelineIcon from '@mui/icons-material/Timeline';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentIcon from '@mui/icons-material/Comment';
import DomainIcon from '@mui/icons-material/Domain';       // Optional: for organization
import PersonIcon from '@mui/icons-material/Person';       // Optional: for "Created By" / "Assigned To"


const initialTasksArray = [
    {
        id: 1,
        title: 'Setup AWS Cognito',
        priority: 'High',
        description: 'Configure authentication',
        status: 'todo',
        creationDate: dayjs().subtract(2, 'day').toISOString(),
        dueDate: dayjs().add(5, 'day').toISOString(),
        assignedTo: 'Unassigned',
        createdBy: 'Unknown',
        projectId: '123',
        projectName: 'Auth Setup',
        orgName: 'TestOrg',
        orgId: 'org1',
        comments: []
    }
];

function Backlog() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tasks, setTasks] = useState(initialTasksArray);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const toggleSidebar = () => setSidebarOpen((open) => !open);

    const fetchTasksFromAPI = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://vgz1orwas6.execute-api.us-east-1.amazonaws.com/dev/Tasks', {
                method: 'GET',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                const transformed = data.map(task => ({
                    id: task.taskId,
                    title: task.taskName,
                    priority: task.priority,
                    description: task.description,
                    status: task.status,
                    creationDate: task.creationDate,
                    dueDate: task.dueDate,
                    assignedTo: task.assignedTo?.fullName || 'Unassigned',
                    createdBy: task.createdBy?.fullName || 'Unknown',
                    projectName: task.projectName || 'Unknown Project',
                    comments: task.comments || [],
                    projectId: task.projectId,
                    orgName: task.orgName,
                    orgId: task.orgId
                }));

                setTasks(transformed);
            } else {
                setError('No tasks data found in API response.');
            }
        } catch (error) {
            console.error('Error fetching tasks from API:', error);
            setError('Failed to fetch tasks from API. Using local data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksFromAPI();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'todo': return 'default';
            case 'inprogress': return 'info';
            case 'done': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onMenuClick={toggleSidebar} />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
                <Box sx={{
                    width: sidebarOpen ? '180px' : '0',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    minWidth: 0,
                }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
                    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon /> Backlog
                        </Typography>

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, maxHeight: '70vh' }}>
                            <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 100, fontSize: '0.85rem' }}><AssignmentIcon fontSize="small" sx={{ mr: 1 }} />Task Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 100, fontSize: '0.85rem' }}><DescriptionIcon fontSize="small" sx={{ mr: 1 }} />Project Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 90, fontSize: '0.85rem' }}><FlagIcon fontSize="small" sx={{ mr: 1 }} />Organization</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 120, fontSize: '0.85rem' }}><DescriptionIcon fontSize="small" sx={{ mr: 1 }} />Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 80, fontSize: '0.85rem' }}><FlagIcon fontSize="small" sx={{ mr: 1 }} />Priority</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 80, fontSize: '0.85rem' }}><TimelineIcon fontSize="small" sx={{ mr: 1 }} />Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 90, fontSize: '0.85rem' }}><EventIcon fontSize="small" sx={{ mr: 1 }} />Assigned To</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 90, fontSize: '0.85rem' }}><EventIcon fontSize="small" sx={{ mr: 1 }} />Created By</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 90, fontSize: '0.85rem' }}><CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />Creation Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 90, fontSize: '0.85rem' }}><CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />Due Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: 70, fontSize: '0.85rem' }}><DescriptionIcon fontSize="small" sx={{ mr: 1 }} />Comments</TableCell>
                                </TableRow>
                            </TableHead>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
                                                <Link
                                                    to={`/task/${task.id}`}
                                                    style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500, fontSize: '0.85rem' }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.location.href = `/task/${task.id}`;
                                                    }}
                                                >
                                                    {task.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{task.projectName || 'N/A'}</TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{task.orgName || 'N/A'}</TableCell>
                                            <TableCell sx={{
                                                maxWidth: 120,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                textAlign: 'left',
                                                fontSize: '0.85rem'
                                            }}>
                                                {task.description}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
                                                <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" sx={{ fontSize: '0.8rem' }} />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
                                                <Chip label={task.status} color={getStatusColor(task.status)} size="small" sx={{ fontSize: '0.8rem' }} />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{task.assignedTo}</TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{task.createdBy}</TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{dayjs(task.creationDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>{dayjs(task.dueDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
                                                <Chip label={task.comments.length} size="small" variant="outlined" sx={{ fontSize: '0.8rem' }} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Backlog;
