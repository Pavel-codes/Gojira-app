import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Chip, Divider, TextField, Button, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';
import { useUsers } from '../context/UsersContext';
import { useProject } from '../context/ProjectContext';
import config from '../config';

const apiUrl = config.apiBaseUrl + config.endpoints.tasks;
const apiUrlComments = config.apiBaseUrl + config.endpoints.comments;

function Task() {
    const { id } = useParams();
    const { isSidebarOpen } = useSidebar();
    const { users } = useUsers();
    const { projects } = useProject();
    
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    // Get organization name from session storage
    const getOrgName = () => {
        if(sessionStorage.getItem('user')){
            const user = JSON.parse(sessionStorage.getItem('user'));
            return user['custom:organization'] || '';
        }
        return '';
    };

    let username = JSON.parse(sessionStorage.getItem('user'))['cognito:username'];

    const fetchTaskFromAPI = async () => {
        setLoading(true);
        setError(null);
        try {
            const orgName = getOrgName();
            console.log('Fetching task with ID:', id, 'for org:', orgName);
            
            const response = await fetch(`${apiUrl}?orgName=${encodeURIComponent(orgName)}&taskId=${id}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('API response for task:', data);
            
            if (data && Array.isArray(data)) {
                // Find the specific task by ID
                const taskData = data.find(task => task.taskId === id || task.taskId === parseInt(id));
                console.log('Found task data:', taskData);
                
                if (taskData) {
                    const transformedTask = {
                        id: taskData.taskId,
                        title: taskData.taskName,
                        priority: taskData.priority,
                        description: taskData.description,
                        status: taskData.status,
                        creationDate: taskData.creationDate,
                        dueDate: taskData.dueDate,
                        assignedTo: users.find(user => user.userId === taskData.assignedTo)?.username || 'Unassigned',
                        createdBy: users.find(user => user.userId === taskData.createdBy)?.username || 'Unknown',
                        projectName: projects.find(project => project.id === taskData.projectId)?.name || 'Unknown Project',
                        comments: taskData.comments || [],
                        projectId: taskData.projectId,
                        orgName: taskData.orgName,
                        orgId: taskData.orgId
                    };
                    console.log('Transformed task:', transformedTask);
                    setTask(transformedTask);
                    setEditData(transformedTask);
                    setComments(taskData.comments || []);
                } else {
                    console.log('Task not found in response. Available tasks:', data.map(t => ({ id: t.taskId, title: t.taskName })));
                    setError('Task not found');
                }
            } else {
                setError('No tasks data found in API response.');
            }
        } catch (error) {
            console.error('Error fetching task from API:', error);
            setError('Failed to fetch task from API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && users.length > 0) {
            fetchTaskFromAPI();
        }
    }, [id, users]);

    const handleAddComment = async () => {
        if (commentInput.trim()) {
            try {
                console.log('Adding comment for task:', task.id);
                console.log('Comment text:', commentInput);
    
                const payload = {
                    taskId: task.id,
                    text: commentInput,
                    fullName: username,
                }
                console.log('Payload:', payload);

                const response = await fetch(apiUrlComments, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorBody = await response.text(); // helpful in debugging
                    throw new Error(`Failed to add comment. Status: ${response.status}. Response: ${errorBody}`);
                }

                const result = await response.json();
                console.log('Comment added successfully:', result);

                const newComment = result?.newComment;
                if (newComment) {
                    setComments(prev => [...prev, newComment]);
                } else {
                    console.warn('No newComment returned in response.');
                }

            setCommentInput('');

            } catch (error) {
                console.error('Error adding comment:', error);
                alert('Failed to add comment. Please try again.');
            }
        }
    };


    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        try {
            console.log('Saving edited task data:', editData);
            
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskId: editData.id,
                    taskName: editData.title,
                    priority: editData.priority,
                    description: editData.description,
                    status: editData.status,
                    dueDate: editData.dueDate,
                    assignedTo: editData.assignedTo,
                    projectId: editData.projectId,
                    orgName: editData.orgName,
                    orgId: editData.orgId
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update task. Status: ${response.status}`);
            }

            const updatedTask = await response.json();
            console.log('Task updated successfully:', updatedTask);
            
            // Update the local task state with the new data
            setTask(editData);
        setEditing(false);
            
            // Optionally show a success message or refresh the task data
            // You could add a success notification here
            
        } catch (error) {
            console.error('Error updating task:', error);
            // You could add error handling here, like showing an error message
            alert('Failed to update task. Please try again.');
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

    if (loading) {
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
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress />
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !task) {
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
                            <Alert severity="error">{error || 'Task not found'}</Alert>
                        </Container>
                    </Box>
                </Box>
            </Box>
        );
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
                    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
                        <Paper sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0'
                        }}>
                            {!editing ? (
                                <>
                                    {/* Header Section */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start',
                                        mb: 3,
                                        pb: 3,
                                        borderBottom: '2px solid #e9ecef'
                                    }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h4" gutterBottom sx={{ 
                                                fontWeight: 700,
                                                color: '#2c3e50',
                                                mb: 1
                                            }}>
                                                {editData.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ 
                                                fontSize: '1.1rem',
                                                lineHeight: 1.6,
                                                color: '#6c757d'
                                            }}>
                                                {editData.description}
                                            </Typography>
                                        </Box>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => setEditing(true)}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                                '&:hover': {
                                                    borderColor: '#1565c0',
                                                    backgroundColor: '#e3f2fd'
                                                }
                                            }}
                                        >
                                            Edit Task
                                        </Button>
                                    </Box>

                                    {/* Task Details Grid */}
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            mb: 2
                                        }}>
                                            Task Details
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                            gap: 3
                                        }}>
                                            {/* Left Column */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Priority
                                                    </Typography>
                                                    <Chip 
                                                        label={editData.priority} 
                                                        color={editData.priority === 'Critical' || editData.priority === 'High' ? 'error' : editData.priority === 'Medium' ? 'warning' : 'success'}
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Status
                                                    </Typography>
                                                    <Chip 
                                                        label={getStatusDisplay(editData.status)} 
                                                        color={editData.status === 'done' ? 'success' : editData.status === 'inProgress' ? 'info' : 'default'}
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Project
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        fontWeight: 500,
                                                        color: '#2c3e50'
                                                    }}>
                                                        {editData.projectName}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Right Column */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Assigned To
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        fontWeight: 500,
                                                        color: '#2c3e50'
                                                    }}>
                                                        {editData.assignedTo}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Created By
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        fontWeight: 500,
                                                        color: '#2c3e50'
                                                    }}>
                                                        {editData.createdBy}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#6c757d',
                                                        mb: 1
                                                    }}>
                                                        Organization
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        fontWeight: 500,
                                                        color: '#2c3e50'
                                                    }}>
                                                        {editData.orgName}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Dates Section */}
                                    <Box sx={{ 
                                        mb: 4,
                                        p: 3,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            mb: 2
                                        }}>
                                            Timeline
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                            gap: 3
                                        }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ 
                                                    fontWeight: 600,
                                                    color: '#6c757d',
                                                    mb: 1
                                                }}>
                                                    Created Date
                                                </Typography>
                                                <Typography variant="body1" sx={{ 
                                                    fontWeight: 500,
                                                    color: '#2c3e50'
                                                }}>
                                                    {dayjs(editData.creationDate).format('MMMM DD, YYYY')}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ 
                                                    fontWeight: 600,
                                                    color: '#6c757d',
                                                    mb: 1
                                                }}>
                                                    Due Date
                                                </Typography>
                                                <Typography variant="body1" sx={{ 
                                                    fontWeight: 500,
                                                    color: '#2c3e50'
                                                }}>
                                                    {dayjs(editData.dueDate).format('MMMM DD, YYYY')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </>
                            ) : (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                                    <Typography variant="h5" sx={{ 
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 2
                                    }}>
                                        Edit Task
                                    </Typography>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={editData.title}
                                        onChange={handleEditChange}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={editData.description}
                                        onChange={handleEditChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                        <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
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
                                        <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
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
                                    </Box>
                                    <TextField
                                        label="Due Date"
                                        name="dueDate"
                                        type="date"
                                        value={editData.dueDate ? editData.dueDate.slice(0, 10) : ''}
                                        onChange={handleEditChange}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            onClick={handleEditSave}
                                            sx={{
                                                borderRadius: 2,
                                                px: 4,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                                                }
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => setEditing(false)}
                                            sx={{
                                                borderRadius: 2,
                                                px: 4,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" sx={{ 
                                fontWeight: 600,
                                color: '#2c3e50',
                                mb: 2
                            }}>
                                Comments ({comments.length})
                            </Typography>
                            <List sx={{ mb: 3 }}>
                                {comments.map((c, idx) => (
                                    <ListItem key={idx} alignItems="flex-start" sx={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        mb: 1,
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <ListItemText 
                                            primary={c.text} 
                                            secondary={dayjs(c.date).format('MMMM DD, YYYY [at] HH:mm')}
                                            primaryTypographyProps={{ 
                                                fontWeight: 500,
                                                color: '#2c3e50'
                                            }}
                                            secondaryTypographyProps={{
                                                color: '#6c757d',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                {comments.length === 0 && (
                                    <Typography variant="body2" sx={{ 
                                        color: '#6c757d',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        py: 2
                                    }}>
                                        No comments yet. Be the first to add one!
                                    </Typography>
                                )}
                            </List>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <TextField
                                    label="Add a comment"
                                    value={commentInput}
                                    onChange={e => setCommentInput(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    onClick={handleAddComment} 
                                    sx={{ 
                                        height: 'fit-content',
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                                        }
                                    }}
                                >
                                    Add Comment
                                </Button>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Task; 