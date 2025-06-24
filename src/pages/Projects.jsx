import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem,
    InputLabel, FormControl, IconButton, Container, Chip, Card,
    CardContent, Grid, Tooltip, Avatar, Divider, CircularProgress
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
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CircleIcon from '@mui/icons-material/Circle';
import { useState } from 'react';
import config from '../config';

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
        error,
        fetchProjectsFromAPI
    } = useProject();

    // Edit project state
    const [editOpen, setEditOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    // Delete project state
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const handleEditProject = async (projectId) => {
        if (!projectId) {
            console.error('Project ID is required for editing');
            return;
        }

        try {
            setEditLoading(true);
            setEditError(null);

            // Find the project to edit
            const projectToEdit = projects.find(p => p.id === projectId);
            if (!projectToEdit) {
                throw new Error('Project not found');
            }

            // Set the project data for editing
            setEditingProject({
                id: projectToEdit.id,
                name: projectToEdit.name || '',
                tag: projectToEdit.tag || '',
                manager: projectToEdit.manager || '',
                description: projectToEdit.description || '',
                status: projectToEdit.status || 'WIP'
            });

            // Open edit modal
            setEditOpen(true);

        } catch (error) {
            console.error('Error preparing project for edit:', error);
            setEditError(error.message || 'Failed to load project for editing');
        } finally {
            setEditLoading(false);
        }
    };

    const handleUpdateProject = async () => {
        if (!editingProject || !editingProject.id) {
            setEditError('Invalid project data');
            return;
        }

        try {
            setEditLoading(true);
            setEditError(null);


            const updateProjectApi = `${config.apiBaseUrl}${config.endpoints.projects}`;
            console.log('api endpoint:', updateProjectApi);
            
            // The projectId MUST be in the body for your current Lambda.
            // Assuming editingProject.id holds the projectId
            const projectId = editingProject.id;
            
            // Construct the payload with keys matching what your Lambda expects
            const payload = {
                projectId: projectId,
                projectName: editingProject.name, 
                projectTag: editingProject.tag,
                projectManager: editingProject.manager,
                description: editingProject.description, 
                projectStatus: editingProject.status
            };
            
            // It should be a simple PUT to the base projects endpoint.
            const response = await fetch(updateProjectApi, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const updatedProject = await response.json();
            console.log('Project updated successfully:', updatedProject);

            // Close modal and reset state
            setEditOpen(false);
            setEditingProject(null);
            setEditError(null);

            // You might want to refresh the projects list here
            // or update the local state with the new data
            fetchProjectsFromAPI();

        } catch (error) {
            console.error('Error updating project:', error);
            setEditError(error.message || 'Failed to update project');
        } finally {
            setEditLoading(false);
        }
    };

    const handleEditInputChange = (field, value) => {
        setEditingProject(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const closeEditModal = () => {
        setEditOpen(false);
        setEditingProject(null);
        setEditError(null);
    };

    const handleDeleteProject = async (projectId) => {
        if (!projectId) {
            console.error('Project ID is required for deletion');
            return;
        }

        // Find the project to show in confirmation dialog
        const project = projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found');
            return;
        }

        // Set the project to delete and open confirmation dialog
        setProjectToDelete(project);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError(null);
            setDeletingProjectId(projectToDelete.id);

            const deleteProjectApi = `${config.apiBaseUrl}${config.endpoints.projects}`;
            console.log('Delete API endpoint:', deleteProjectApi);

            // Use query string parameter for projectId instead of request body
            const deleteUrl = `${deleteProjectApi}?projectId=${encodeURIComponent(projectToDelete.id)}`;

            // Make DELETE request to the projects endpoint with query parameter
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
                // No body needed since we're using query parameters
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const deleteResult = await response.json();
            console.log('Project deleted successfully:', deleteResult);

            // Close confirmation dialog
            setDeleteConfirmOpen(false);
            setProjectToDelete(null);

            // Refresh the page to update the projects list
            fetchProjectsFromAPI();

        } catch (error) {
            console.error('Error deleting project:', error);
            setDeleteError(error.message || 'Failed to delete project');
            alert(`Error deleting project: ${error.message}`);
        } finally {
            setDeleteLoading(false);
            setDeletingProjectId(null);
        }
    };

    const cancelDeleteProject = () => {
        setDeleteConfirmOpen(false);
        setProjectToDelete(null);
        setDeleteError(null);
    };

    const getProjectStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return '#4caf50';
            case 'completed': return '#2196f3';
            case 'on hold': return '#ff9800';
            case 'cancelled': return '#f44336';
            default: return '#757575';
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f8f9fa' }}>
                <Sidebar />
                <Box sx={{ 
                    flex: 1, 
                    p: 3, 
                    overflow: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                }}>
                    <Container maxWidth={false} sx={{ 
                        mt: 2, 
                        mb: 4,
                        px: 0
                    }}>
                        {/* Header Section */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 4,
                            pb: 2,
                            borderBottom: '2px solid #e9ecef'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ 
                                    backgroundColor: '#1976d2',
                                    width: 48,
                                    height: 48
                                }}>
                                    <BusinessIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        fontSize: { xs: '1.5rem', md: '2rem' }
                                    }}>
                                        All Projects
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#6c757d',
                                        mt: 0.5
                                    }}>
                                        Manage and track all your organization's projects
                                    </Typography>
                                </Box>
                            </Box>
                            <Button 
                                variant="contained" 
                                onClick={openAddProjectModal}
                                startIcon={<AddIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                    }
                                }}
                            >
                                Add Project
                            </Button>
                        </Box>

                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                    {projects.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Total Projects
                                                </Typography>
                                            </Box>
                                            <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    color: 'white'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                    {projects.filter(p => p.status?.toLowerCase() === 'active').length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Active Projects
                                                </Typography>
                                            </Box>
                                            <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                    color: 'white'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                    {projects.filter(p => p.status?.toLowerCase() === 'completed').length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Completed
                                                </Typography>
                                            </Box>
                                            <DescriptionIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                    color: 'white'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                    {managers.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Project Managers
                                                </Typography>
                                            </Box>
                                            <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Projects Table */}
                        {loading ? (
                            <Card sx={{ 
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                p: 4,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" sx={{ color: '#6c757d' }}>
                                    Loading projects...
                                </Typography>
                            </Card>
                        ) : error ? (
                            <Card sx={{ 
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                p: 4,
                                textAlign: 'center',
                                border: '2px solid #f44336'
                            }}>
                                <Typography variant="h6" color="error">
                                    {error}
                                </Typography>
                            </Card>
                        ) : (
                            <Card sx={{ 
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                overflow: 'hidden'
                            }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <BusinessIcon fontSize="small" />
                                                        Name
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TagIcon fontSize="small" />
                                                        Tag
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PersonIcon fontSize="small" />
                                                        Manager
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <DescriptionIcon fontSize="small" />
                                                        Description
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CircleIcon fontSize="small" />
                                                        Status
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600,
                                                    color: '#2c3e50',
                                                    borderBottom: '2px solid #e9ecef'
                                                }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {projects.map((project, index) => (
                                                <TableRow 
                                                    key={project.id}
                                                    sx={{ 
                                                        '&:hover': {
                                                            backgroundColor: '#f8f9fa',
                                                            transition: 'background-color 0.2s ease'
                                                        },
                                                        '&:last-child td': { border: 0 }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ 
                                                            fontWeight: 600,
                                                            color: '#2c3e50'
                                                        }}>
                                                            {project.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={project.tag || 'N/A'}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                borderColor: '#1976d2',
                                                                color: '#1976d2',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar sx={{ 
                                                                width: 32, 
                                                                height: 32,
                                                                backgroundColor: '#1976d2',
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                {project.manager?.charAt(0) || 'U'}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                                                                {project.manager || 'Unassigned'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ 
                                                            color: '#6c757d',
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {project.description || 'No description'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={project.status || 'WIP'}
                                                            size="small"
                                                            sx={{ 
                                                                backgroundColor: getProjectStatusColor(project.status || 'WIP'),
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                minWidth: 60
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Edit Project">
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleEditProject(project.id)}
                                                                    sx={{
                                                                        color: '#1976d2',
                                                                        '&:hover': {
                                                                            backgroundColor: '#e3f2fd'
                                                                        }
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Project">
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleDeleteProject(project.id)}
                                                                    disabled={deleteLoading && deletingProjectId === project.id}
                                                                    sx={{
                                                                        color: deleteLoading && deletingProjectId === project.id ? '#ccc' : '#f44336',
                                                                        '&:hover': {
                                                                            backgroundColor: deleteLoading && deletingProjectId === project.id ? 'transparent' : '#ffebee'
                                                                        }
                                                                    }}
                                                                >
                                                                    {deleteLoading && deletingProjectId === project.id ? (
                                                                        <CircularProgress size={16} color="inherit" />
                                                                    ) : (
                                                                        <DeleteIcon fontSize="small" />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                
                                {projects.length === 0 && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        py: 8,
                                        color: '#9e9e9e'
                                    }}>
                                        <BusinessIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            No projects found
                                        </Typography>
                                        <Typography variant="body2">
                                            Get started by creating your first project
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        )}
                    </Container>
                </Box>
            </Box>

            {/* Add Project Modal */}
            <Dialog 
                open={addOpen} 
                onClose={closeAddProjectModal} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    borderBottom: '2px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar sx={{ 
                        backgroundColor: '#1976d2',
                        width: 40,
                        height: 40
                    }}>
                        <AddIcon />
                    </Avatar>
                    <Box component="span" sx={{ 
                        fontWeight: 600, 
                        color: '#2c3e50',
                        fontSize: '1.25rem'
                    }}>
                        Add New Project
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3, 
                    mt: 2,
                    pt: 2
                }}>
                    <TextField
                        label="Project Name"
                        name="name"
                        value={newProject.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <TextField
                        label="Tag"
                        name="tag"
                        value={newProject.tag}
                        onChange={handleInputChange}
                        fullWidth
                        inputProps={{ maxLength: 8 }}
                        helperText="Up to 8 characters. If left blank, will be auto-generated."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Project Manager</InputLabel>
                        <Select
                            name="manager"
                            value={newProject.manager}
                            label="Project Manager"
                            onChange={handleInputChange}
                            sx={{
                                borderRadius: 2
                            }}
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
                        minRows={3}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={closeAddProjectModal}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddProject} 
                        variant="contained" 
                        disabled={!newProject.name}
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
                        Add Project
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Project Modal */}
            <Dialog 
                open={editOpen} 
                onClose={closeEditModal} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    borderBottom: '2px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar sx={{ 
                        backgroundColor: '#1976d2',
                        width: 40,
                        height: 40
                    }}>
                        <EditIcon />
                    </Avatar>
                    <Box component="span" sx={{ 
                        fontWeight: 600, 
                        color: '#2c3e50',
                        fontSize: '1.25rem'
                    }}>
                        Edit Project
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3, 
                    mt: 2,
                    pt: 2
                }}>
                    <TextField
                        label="Project Name"
                        name="name"
                        value={editingProject?.name}
                        onChange={(e) => handleEditInputChange('name', e.target.value)}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <TextField
                        label="Tag"
                        name="tag"
                        value={editingProject?.tag}
                        onChange={(e) => handleEditInputChange('tag', e.target.value)}
                        fullWidth
                        inputProps={{ maxLength: 8 }}
                        helperText="Up to 8 characters. If left blank, will be auto-generated."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Project Manager</InputLabel>
                        <Select
                            name="manager"
                            value={editingProject?.manager}
                            label="Project Manager"
                            onChange={(e) => handleEditInputChange('manager', e.target.value)}
                            sx={{
                                borderRadius: 2
                            }}
                        >
                            {managers.map((m) => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Description"
                        name="description"
                        value={editingProject?.description}
                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editingProject?.status}
                            label="Status"
                            onChange={(e) => handleEditInputChange('status', e.target.value)}
                            sx={{
                                borderRadius: 2
                            }}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="On Hold">On Hold</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={closeEditModal}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateProject} 
                        variant="contained" 
                        disabled={!editingProject || editLoading}
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
                        {editLoading ? 'Updating...' : 'Update Project'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteConfirmOpen} 
                onClose={cancelDeleteProject} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    borderBottom: '2px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar sx={{ 
                        backgroundColor: '#f44336',
                        width: 40,
                        height: 40
                    }}>
                        <DeleteIcon />
                    </Avatar>
                    <Box component="span" sx={{ 
                        fontWeight: 600, 
                        color: '#2c3e50',
                        fontSize: '1.25rem'
                    }}>
                        Delete Project
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2, 
                    mt: 2,
                    pt: 2
                }}>
                    <Typography variant="body1" sx={{ color: '#2c3e50', mb: 1 }}>
                        Are you sure you want to delete this project?
                    </Typography>
                    
                    {projectToDelete && (
                        <Card sx={{ 
                            border: '2px solid #ffebee',
                            backgroundColor: '#fff5f5',
                            borderRadius: 2
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" sx={{ 
                                    color: '#d32f2f', 
                                    fontWeight: 600,
                                    mb: 1
                                }}>
                                    {projectToDelete.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {projectToDelete.description || 'No description'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                        label={projectToDelete.tag || 'N/A'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    />
                                    <Chip 
                                        label={projectToDelete.status || 'WIP'}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: getProjectStatusColor(projectToDelete.status || 'WIP'),
                                            color: 'white',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                    
                    <Typography variant="body2" sx={{ 
                        color: '#f44336', 
                        fontWeight: 500,
                        backgroundColor: '#ffebee',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid #ffcdd2'
                    }}>
                        ⚠️ This action cannot be undone. The project and all its associated data will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={cancelDeleteProject}
                        disabled={deleteLoading}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDeleteProject} 
                        variant="contained" 
                        disabled={deleteLoading}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            backgroundColor: '#f44336',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc'
                            }
                        }}
                    >
                        {deleteLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} color="inherit" />
                                Deleting...
                            </Box>
                        ) : (
                            'Delete Project'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Projects;
