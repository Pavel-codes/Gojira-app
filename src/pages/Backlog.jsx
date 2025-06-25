import { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box,
    Chip, Alert, CircularProgress, TextField, InputAdornment
} from '@mui/material';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useProject } from '../context/ProjectContext';
import { useUsers } from '../context/UsersContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import FlagIcon from '@mui/icons-material/Flag';
import TimelineIcon from '@mui/icons-material/Timeline';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import config from '../config';

const apiUrl = config.apiBaseUrl + config.endpoints.tasks;
const initialTasksArray = [];

function Backlog() {
    const { projects } = useProject();
    const { users } = useUsers();
    const { isSidebarOpen } = useSidebar();
    const [tasks, setTasks] = useState(initialTasksArray);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Get organization name from session storage inside the component
    const getOrgName = () => {
        if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user'));
            return user['custom:organization'] || '';
        }
        return '';
    };

    const orgName = getOrgName();

    const fetchTasksFromAPI = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {

            const response = await fetch(`${apiUrl}?orgName=${encodeURIComponent(orgName)} `, {
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
                    assignedTo: users.find(user => user.userId === task.assignedTo)?.username || 'Unassigned',
                    createdBy: users.find(user => user.userId === task.createdBy)?.username || 'Unknown',
                    projectName: projects.find(project => project.id === task.projectId)?.name || 'Unknown Project',
                    comments: task.comments || [],
                    projectId: task.projectId,
                    orgName: task.orgName,
                   
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
    }, [users, orgName]);

    useEffect(() => {
        // Only fetch tasks if we have a valid organization and users data
        if (orgName && users.length > 0) {
            fetchTasksFromAPI();
        } else {
            console.log('Waiting for organization and users to load...', { orgName, usersLength: users.length });
        }
    }, [users, orgName, fetchTasksFromAPI]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'error';
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

    const getStatusDisplay = (status) => {
        switch (status?.toLowerCase()) {
            case 'todo': return 'To do';
            case 'inprogress': return 'In progress';
            case 'done': return 'Done';
            default: return status;
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
                <Sidebar />
                <Box sx={{
                    flex: 1,
                    p: 4,
                    overflow: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                }}>
                    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon /> Backlog
                        </Typography>

                        {/* Search Input */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            sx={{ mb: 2, width: '100%', maxWidth: 400 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                        )}

                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, maxHeight: '70vh' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><AssignmentIcon fontSize="small" /> Task</TableCell>
                                        <TableCell><DescriptionIcon fontSize="small" /> Project</TableCell>
                                        <TableCell><DescriptionIcon fontSize="small" /> Description</TableCell>
                                        <TableCell><FlagIcon fontSize="small" /> Priority</TableCell>
                                        <TableCell><TimelineIcon fontSize="small" /> Status</TableCell>
                                        <TableCell><EventIcon fontSize="small" /> Assignee</TableCell>
                                        <TableCell><EventIcon fontSize="small" /> Creator</TableCell>
                                        <TableCell><CalendarTodayIcon fontSize="small" /> Created</TableCell>
                                        <TableCell><CalendarTodayIcon fontSize="small" /> Due</TableCell>
                                        <TableCell><DescriptionIcon fontSize="small" /> Comments</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(searchTerm
                                        ? tasks.filter(task => {
                                            const term = searchTerm.toLowerCase();
                                            return (
                                                task.title?.toLowerCase().includes(term) ||
                                                task.description?.toLowerCase().includes(term) ||
                                                task.assignedTo?.toLowerCase().includes(term) ||
                                                task.projectName?.toLowerCase().includes(term)
                                            );
                                        })
                                        : tasks
                                    ).map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell>
                                                <Link to={`/task/${task.id}`} style={{ textDecoration: 'none' }}>
                                                    {task.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{task.projectName || 'N/A'}</TableCell>
                                            <TableCell sx={{
                                                maxWidth: 120,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>{task.description}</TableCell>
                                            <TableCell>
                                                <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={getStatusDisplay(task.status)} color={getStatusColor(task.status)} size="small" />
                                            </TableCell>
                                            <TableCell>{task.assignedTo}</TableCell>
                                            <TableCell>{task.createdBy}</TableCell>
                                            <TableCell>{dayjs(task.creationDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell>{dayjs(task.dueDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell>
                                                <Chip label={task.comments.length} size="small" variant="outlined" />
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
