import { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

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
    // Combine all tasks into one array
    const allTasks = [
        ...initialTasks.todo,
        ...initialTasks.inProgress,
        ...initialTasks.done,
    ];
    const toggleSidebar = () => setSidebarOpen((open) => !open);
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
                        <Typography variant="h4" gutterBottom>Backlog</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Creation Date</TableCell>
                                        <TableCell>Due Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allTasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                <Link to={`/task/${task.id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                                                    {task.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell>{task.priority}</TableCell>
                                            <TableCell>{task.status}</TableCell>
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