import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem,
    InputLabel, FormControl, IconButton, Container
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';
import { useProject } from '../context/ProjectContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TagIcon from '@mui/icons-material/LabelOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';

const Projects = () => {
    const { isSidebarOpen } = useSidebar();
    const {
        projects,
        managers,
        addOpen,
        newProject,
        openAddProjectModal,
        closeAddProjectModal,
        handleInputChange,
        handleAddProject,
        loading,
        error
    } = useProject();

    const handleEditProject = (projectId) => {
        alert(`Edit project ${projectId} - logic not implemented`);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm(`Are you sure you want to delete project ${projectId}?`)) {
            alert(`Delete project ${projectId} - logic not implemented`);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>

            <Box sx={{ flexGrow: 1, ml: isSidebarOpen ? '240px' : 0, transition: 'margin-left 0.3s ease' }}>
                <Navbar />

                <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4">All Projects</Typography>
                        <Button variant="contained" onClick={openAddProjectModal}>Add Project</Button>
                    </Box>

                    <Sidebar />

                    {loading ? (
                        <Typography>Loading projects...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><AssignmentIcon fontSize="small" sx={{ mr: 1 }} />ID</TableCell>
                                        <TableCell><AssignmentIcon fontSize="small" sx={{ mr: 1 }} />Name</TableCell>
                                        <TableCell><TagIcon fontSize="small" sx={{ mr: 1 }} />Tag</TableCell>
                                        <TableCell><PersonIcon fontSize="small" sx={{ mr: 1 }} />Manager</TableCell>
                                        <TableCell><DescriptionIcon fontSize="small" sx={{ mr: 1 }} />Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>{project.id}</TableCell>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{project.tag}</TableCell>
                                            <TableCell>{project.manager}</TableCell>
                                            <TableCell>{project.description}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" onClick={() => handleEditProject(project.id)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteProject(project.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>

                {/* Add Project Modal */}
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
            </Box>
        </Box>
    );
};

export default Projects;
