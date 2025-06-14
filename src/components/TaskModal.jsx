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
} from '@mui/material';

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="project"
                            label="Project"
                            value={formData.project}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Parent Task</InputLabel>
                            <Select
                                name="parentTask"
                                value={formData.parentTask}
                                onChange={handleChange}
                                label="Parent Task"
                            >
                                <MenuItem value="">None</MenuItem>
                                {tasks.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Created by</InputLabel>
                            <Select
                                name="createdBy"
                                value={formData.createdBy}
                                onChange={handleChange}
                                label="Created by"
                            >
                                {users.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Assigned to</InputLabel>
                            <Select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                label="Assigned to"
                            >
                                {users.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                label="Priority"
                            >
                                {priorities.map((priority) => (
                                    <MenuItem key={priority} value={priority}>
                                        {priority}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            name="creationDate"
                            label="Creation Date"
                            type="date"
                            value={formData.creationDate ? formData.creationDate.slice(0, 10) : ''}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            value={formData.dueDate ? formData.dueDate.slice(0, 10) : ''}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {task ? 'Save Changes' : 'Create Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default TaskModal; 