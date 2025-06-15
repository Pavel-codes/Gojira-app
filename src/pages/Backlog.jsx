import { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Chip } from '@mui/material';
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

const initialTasks = {
    todo: [
        { id: 1, title: 'Setup AWS Cognito', priority: 'High', description: 'Configure authentication', status: 'todo', creationDate: dayjs().subtract(2, 'day').toISOString(), dueDate: dayjs().add(5, 'day').toISOString() },
        { id: 2, title: 'Design Database Schema', priority: 'Medium', description: 'Create ERD', status: 'todo', creationDate: dayjs().subtract(1, 'day').toISOString(), dueDate: dayjs().add(6, 'day').toISOString() },
    ],
    inProgress: [
        { id: 3, title: 'Implement Login Flow', priority: 'High', description: 'Connect to Cognito', status: 'inProgress', creationDate: dayjs().subtract(3, 'day').toISOString(), dueDate: dayjs().add(3, 'day').toISOString() },
    ],
    done: [
        { id: 4, title: 'Project Setup', priority: 'Low', description: 'Initialize React project', status: 'done', creationDate: dayjs().subtract(7, 'day').toISOString(), dueDate: dayjs().subtract(1, 'day').toISOString() },
    ],
};

function Backlog() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const allTasks = [
        ...initialTasks.todo,
        ...initialTasks.inProgress,
        ...initialTasks.done,
    ];
    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const navigate = useNavigate();

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return 'default';
            case 'inprogress':
                return 'info';
            case 'done':
                return 'success';
            default:
                return 'default';
        }
    };

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
                        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon /> Backlog
                        </Typography>
                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}><AssignmentIcon sx={{ mr: 1 }} />Title</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}><DescriptionIcon sx={{ mr: 1 }} />Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}><FlagIcon sx={{ mr: 1 }} />Priority</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}><TimelineIcon sx={{ mr: 1 }} />Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}><EventIcon sx={{ mr: 1 }} />Creation Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}><CalendarTodayIcon sx={{ mr: 1 }} />Due Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTasks.map((task) => (
                                        <TableRow
                                            key={task.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Link
                                                    to={`/task/${task.id}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: '#1976d2',
                                                        fontWeight: 500
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.location.href = `/task/${task.id}`;
                                                    }}
                                                >
                                                    {task.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={task.priority}
                                                    color={getPriorityColor(task.priority)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={task.status}
                                                    color={getStatusColor(task.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{dayjs(task.creationDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell>{dayjs(task.dueDate).format('YYYY-MM-DD')}</TableCell>
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