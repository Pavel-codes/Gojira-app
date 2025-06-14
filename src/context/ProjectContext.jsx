import { createContext, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

const ProjectContext = createContext(null);

const initialProjects = [
    { id: 1, name: 'Attack Stack', tag: 'ATCK', manager: 'Alice', description: 'Security project for attack simulation.' },
    { id: 2, name: 'Platform', tag: 'PLAT', manager: 'Bob', description: 'Core platform for all teams.' },
];

const managers = ['Alice', 'Bob', 'Charlie'];

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState(initialProjects);
    const [addOpen, setAddOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', tag: '', manager: managers[0], description: '' });

    const openAddProjectModal = () => setAddOpen(true);
    const closeAddProjectModal = () => setAddOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProject = () => {
        const nextId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        setProjects([
            ...projects,
            {
                id: nextId,
                name: newProject.name,
                tag: newProject.tag || newProject.name.slice(0, 4).toUpperCase(),
                manager: newProject.manager,
                description: newProject.description,
            },
        ]);
        setNewProject({ name: '', tag: '', manager: managers[0], description: '' });
        setAddOpen(false);
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            managers,
            addOpen,
            newProject,
            openAddProjectModal,
            closeAddProjectModal,
            handleInputChange,
            handleAddProject,
        }}>
            {children}
            {/* Add Project Modal rendered globally */}
            <Dialog open={addOpen} onClose={closeAddProjectModal} maxWidth="xs" fullWidth>
                <DialogTitle>Add Project</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Project Name"
                        name="name"
                        value={newProject.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Tag"
                        name="tag"
                        value={newProject.tag}
                        onChange={handleInputChange}
                        fullWidth
                        inputProps={{ maxLength: 8 }}
                        helperText="Up to 8 characters. If left blank, will be auto-generated."
                    />
                    <FormControl fullWidth>
                        <InputLabel>Project Manager</InputLabel>
                        <Select
                            name="manager"
                            value={newProject.manager}
                            label="Project Manager"
                            onChange={handleInputChange}
                        >
                            {managers.map((m) => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Description"
                        name="description"
                        value={newProject.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        minRows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddProjectModal}>Cancel</Button>
                    <Button onClick={handleAddProject} variant="contained" disabled={!newProject.name}>Add</Button>
                </DialogActions>
            </Dialog>
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error('useProject must be used within a ProjectProvider');
    return context;
}; 