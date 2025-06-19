import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem,
    InputLabel, FormControl
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';
import { useProject } from '../context/ProjectContext';

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

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, ml: isSidebarOpen ? '240px' : 0, transition: 'margin-left 0.3s ease' }}>
                <Navbar />
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4">All Projects</Typography>
                        <Button variant="contained" onClick={openAddProjectModal}>Add Project</Button>
                    </Box>

                    {loading ? (
                        <Typography>Loading projects...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Tag</TableCell>
                                        <TableCell>Manager</TableCell>
                                        <TableCell>Description</TableCell>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

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
