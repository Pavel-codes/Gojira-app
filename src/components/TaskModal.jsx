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

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['To Do', 'In Progress', 'Done'];

function TaskModal({ open, onClose, onSave, task, users = [], tasks = [] }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'todo',
        project: '',
        parentTask: '',
        createdBy: '',
        assignedTo: '',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                ...task,
                status: task.status || 'todo',
                creationDate: task.creationDate || new Date().toISOString(),
                dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                project: task.project || '',
                parentTask: task.parentTask || '',
                createdBy: task.createdBy || '',
                assignedTo: task.assignedTo || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                status: 'todo',
                creationDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                project: '',
                parentTask: '',
                createdBy: '',
                assignedTo: '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const statusMap = {
            'To Do': 'todo',
            'In Progress': 'inProgress',
            'Done': 'done',
        };
        onSave({
            ...formData,
            status: statusMap[formData.status] || formData.status,
        });
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
                                    name="title"
                                    value={formData.title}
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
                                        Project
                                    </Typography>
                                    <TextField
                                        name="project"
                                        value={formData.project}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="Project name..."
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
                                                <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
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
                                        <Select
                                            name="createdBy"
                                            value={formData.createdBy}
                                            onChange={handleChange}
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {users.map((u) => (
                                                <MenuItem key={u.id} value={u.id}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                            {u.name?.charAt(0) || 'U'}
                                                        </Avatar>
                                                        {u.name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
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
                                            value={formData.assignedTo}
                                            onChange={handleChange}
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            {users.map((u) => (
                                                <MenuItem key={u.id} value={u.id}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                            {u.name?.charAt(0) || 'U'}
                                                        </Avatar>
                                                        {u.name}
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
                                        Due Date
                                    </Typography>
                                    <TextField
                                        name="dueDate"
                                        type="date"
                                        value={formData.dueDate ? formData.dueDate.slice(0, 10) : ''}
                                        onChange={handleChange}
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
                        disabled={!formData.title || !formData.createdBy || !formData.assignedTo}
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