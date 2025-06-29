import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Avatar,
    Chip,
    Typography,
    Divider,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['To Do', 'In Progress', 'Done'];

function TaskModal({ open, onClose, onSave, task, users = [], tasks = [], mode = 'create' }) {
    const { user } = useAuth();
    const { projects } = useProject();
    
    // Get user information from AuthContext - handle both JWT and profile data
    const userProfile = user?.profile || user;
    const fullName = userProfile ? `${userProfile.name || ''} ${userProfile.family_name || ''}`.trim() : '';
    const organization = user?.['custom:organization'] || user?.organization || userProfile?.organization || '';
    
    const initialFormData = {
        taskName: '',
        description: '',
        priority: 'Medium',
        status: 'todo',
        dueDate: '',
        projectId: '',
        orgName: organization,
        parentTask: '',
        createdBy: user?.sub || 'admin',
        assignedTo: '',
        creationDate: new Date().toISOString()
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (open && mode === 'create') {
            setFormData({
                ...initialFormData,
                orgName: organization,
                createdBy: user?.sub || 'admin'
            });
        }
    }, [open, mode, user, organization]);

    useEffect(() => {
        if (task && mode === 'edit') {
            const statusMap = {
                todo: 'To Do',
                inProgress: 'In Progress',
                done: 'Done',
            };
            setFormData({
                taskName: task.taskName || '',
                description: task.description || '',
                priority: task.priority || 'Medium',
                status: statusMap[task.status] || task.status || 'To Do',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
                projectId: task.projectId || '',
                orgName: task.orgName || organization,
                parentTask: task.parentTask || '',
                createdBy: task.createdBy || user?.sub || 'admin',
                assignedTo: task.assignedTo || '',
                creationDate: task.creationDate || new Date().toISOString()
            });
        }
    }, [task, mode, user, organization]);

    // Debug logging for user data
    useEffect(() => {
        if (open) {
            console.log('TaskModal - User data:', {
                user,
                userProfile,
                fullName,
                organization,
                users: users.length
            });
            console.log('TaskModal - Tasks for parent dropdown:', tasks);
            console.log('TaskModal - Current formData.parentTask:', formData.parentTask);
        }
    }, [open, user, userProfile, fullName, organization, users, tasks, formData.parentTask]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('TaskModal - handleChange:', { name, value });
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
    };
    useEffect(() => {
        console.log('Form updated:', formData);
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const statusMap = {
            'To Do': 'todo',
            'In Progress': 'inProgress',
            'Done': 'done',
        };
    
        // THIS IS THE PAYLOAD SENT TO LAMBDA - KEEP IT AS IS
        const payload = {
            ...formData,
            status: statusMap[formData.status] || formData.status,
            creationDate: mode === 'edit' && task?.creationDate ? task.creationDate : (formData.creationDate ? new Date(formData.creationDate).toISOString() : new Date().toISOString()),
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null, // Set to null if empty
            taskId: task?.taskId || undefined, // Send taskId if it's an existing task being updated
        };
    
        console.log("Sending payload to backend:", JSON.stringify(payload));
        const apiUrl = config.apiBaseUrl + config.endpoints.tasks;
        console.log("API URL:", apiUrl);
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST', // Or 'PUT' if you differentiate between create/update
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers if needed
                },
                body: JSON.stringify(payload),
            });
    
            console.log("Raw Response Object from Lambda:", response);
            console.log("Response status:", response.status);
            console.log("Response OK:", response.ok);
    
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("HTTP error response body:", errorBody);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
    
            const contentType = response.headers.get('content-type');
            let backendResponseData = {};
            if (contentType && contentType.includes('application/json')) {
                backendResponseData = await response.json(); // This will be {message, taskId, topicArn}
                console.log('Lambda Response Data (parsed JSON):', backendResponseData);
            } else {
                const rawText = await response.text();
                console.warn('Response content-type is not JSON. Raw response:', rawText);
            }

            const taskObjectForContext = {
                ...payload, // Use the 'payload' that was *sent*, as it contains all original form data and correct status.
                           // This ensures consistency with what you wanted to save.
                taskId: backendResponseData.taskId, // Override or add the taskId from the backend
                id: backendResponseData.taskId, // Use backend taskId as the primary ID for React lists
            };
    
            console.log("Task object passed to onSave (for context update):", taskObjectForContext);
            onSave(taskObjectForContext); // Pass this rich object to the context's handleSaveTask
            onClose();
    
        } catch (error) {
            console.error('Failed to create/update task (catch block):', error);
            // Optionally show an error message to the user (e.g., using a state for snackbar)
        }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'todo': return '#ff9800';
            case 'inProgress': return '#2196f3';
            case 'done': return '#4caf50';
            default: return '#757575';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                pb: 1,
                borderBottom: '2px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8f9fa'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                        backgroundColor: task ? '#ff9800' : '#1976d2',
                        width: 40,
                        height: 40
                    }}>
                        <AssignmentIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#2c3e50',
                            mb: 0.5
                        }}>
                            {task ? 'Edit Task' : 'Create New Task'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {task ? 'Update task details and assignments' : 'Add a new task to your project'}
                        </Typography>
                    </Box>
                </Box>
                <Tooltip title="Close">
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: '#666',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#f44336'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4, pt: 3 }}>
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={12} md={8}>
                            {/* Task Title */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <AssignmentIcon fontSize="small" />
                                    Task Title *
                                </Typography>
                                <TextField
                                    name="taskName"
                                    value={formData.taskName}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    placeholder="Enter task title..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#ffffff'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <DescriptionIcon fontSize="small" />
                                    Description
                                </Typography>
                                <TextField
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder="Describe the task details..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#ffffff'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Project and Parent Task */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <BusinessIcon fontSize="small" />
                                        Project *
                                    </Typography>
                                    <FormControl fullWidth required>
                                        <Select
                                            name="projectId"
                                            value={formData.projectId || ''}
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {projects.map((project) => (
                                                <MenuItem key={project.id} value={project.id}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {project.name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1
                                    }}>
                                        Parent Task
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            name="parentTask"
                                            value={formData.parentTask}
                                            onChange={handleChange}
                                            displayEmpty
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#fafafa',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#ffffff'
                                                }
                                            }}
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            {tasks.map((t) => (
                                                <MenuItem key={t.taskId || t.id} value={t.taskId || t.id}>
                                                    {t.taskName || t.title || 'Untitled Task'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 2,
                                p: 3,
                                height: 'fit-content'
                            }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    mb: 3
                                }}>
                                    Task Details
                                </Typography>

                                {/* Priority */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <FlagIcon fontSize="small" />
                                        Priority
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {priorities.map((priority) => (
                                                <MenuItem key={priority} value={priority}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: getPriorityColor(priority)
                                                        }} />
                                                        {priority}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Status */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1
                                    }}>
                                        Status
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {statuses.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: getStatusColor(status.toLowerCase().replace(' ', ''))
                                                        }} />
                                                        {status}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Created By */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <PersonIcon fontSize="small" />
                                        Created By *
                                    </Typography>
                                    <FormControl fullWidth required>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#1976d2' }}>
                                                {fullName ? (userProfile?.name?.[0] || userProfile?.family_name?.[0] || 'U') : (user?.username?.[0] || 'A')}
                                            </Avatar>
                                            <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                                                {fullName || (user?.username === 'admin' ? 'Admin' : user?.username || user?.email || 'Unknown User')}
                                            </Typography>
                                        </Box>
                                    </FormControl>
                                </Box>

                                {/* Assigned To */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <PersonIcon fontSize="small" />
                                        Assigned To *
                                    </Typography>
                                    <FormControl fullWidth required>
                                        <Select
                                            name="assignedTo"
                                            value={formData.assignedTo || ''}
                                            onChange={handleChange}
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {users.map((userItem) => (
                                                <MenuItem key={userItem.userId} value={userItem.userId}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem' }}>
                                                            {userItem.name?.[0]}{userItem.family_name?.[0]}
                                                        </Avatar>
                                                        {userItem.name} {userItem.family_name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Dates */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <CalendarTodayIcon fontSize="small" />
                                        Due Date *
                                    </Typography>
                                    <TextField
                                        name="dueDate"
                                        type="date"
                                        value={formData.dueDate ? formData.dueDate.slice(0, 10) : ''}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{
                    p: 3,
                    pt: 2,
                    borderTop: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa'
                }}>
                    <Button
                        onClick={onClose}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#666'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!formData.taskName || !formData.createdBy || !formData.assignedTo || !formData.projectId || !formData.dueDate}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                            }
                        }}
                    >
                        {task ? 'Save Changes' : 'Create Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default TaskModal; 