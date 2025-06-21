import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Chip, Divider, TextField, Button, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';

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

function findTaskById(id) {
    const all = [...initialTasks.todo, ...initialTasks.inProgress, ...initialTasks.done];
    return all.find((t) => String(t.id) === String(id));
}

function Task() {
    const { id } = useParams();
    const { isSidebarOpen } = useSidebar();
    const task = findTaskById(id);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(task ? { ...task } : null);

    const handleAddComment = () => {
        if (commentInput.trim()) {
            setComments([...comments, { text: commentInput, date: new Date().toISOString() }]);
            setCommentInput('');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = () => {
        setEditing(false);
        // In a real app, update the backend here
    };

    if (!task) {
        return <Typography variant="h6">Task not found</Typography>;
    }

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
                    <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            {!editing ? (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h4" gutterBottom>{editData.title}</Typography>
                                        <Button variant="outlined" onClick={() => setEditing(true)}>Edit</Button>
                                    </Box>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>{editData.description}</Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Chip label={editData.priority} color="primary" />
                                        <Chip label={editData.status} />
                                        <Chip label={`Created: ${dayjs(editData.creationDate).format('YYYY-MM-DD')}`} />
                                        <Chip label={`Due: ${dayjs(editData.dueDate).format('YYYY-MM-DD')}`} />
                                    </Box>
                                </>
                            ) : (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={editData.title}
                                        onChange={handleEditChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={editData.description}
                                        onChange={handleEditChange}
                                        fullWidth
                                        multiline
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            name="priority"
                                            value={editData.priority}
                                            label="Priority"
                                            onChange={handleEditChange}
                                        >
                                            <MenuItem value="Low">Low</MenuItem>
                                            <MenuItem value="Medium">Medium</MenuItem>
                                            <MenuItem value="High">High</MenuItem>
                                            <MenuItem value="Critical">Critical</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={editData.status}
                                            label="Status"
                                            onChange={handleEditChange}
                                        >
                                            <MenuItem value="todo">To Do</MenuItem>
                                            <MenuItem value="inProgress">In Progress</MenuItem>
                                            <MenuItem value="done">Done</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Due Date"
                                        name="dueDate"
                                        type="date"
                                        value={editData.dueDate ? editData.dueDate.slice(0, 10) : ''}
                                        onChange={handleEditChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button variant="contained" onClick={handleEditSave}>Save</Button>
                                        <Button variant="outlined" onClick={() => setEditing(false)}>Cancel</Button>
                                    </Box>
                                </Box>
                            )}
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6">Comments</Typography>
                            <List>
                                {comments.map((c, idx) => (
                                    <ListItem key={idx} alignItems="flex-start">
                                        <ListItemText primary={c.text} secondary={dayjs(c.date).format('YYYY-MM-DD HH:mm')} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <TextField
                                    label="Add a comment"
                                    value={commentInput}
                                    onChange={e => setCommentInput(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                />
                                <Button variant="contained" onClick={handleAddComment} sx={{ height: 'fit-content' }}>Add</Button>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Task; 