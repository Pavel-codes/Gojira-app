import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem,
    InputLabel, FormControl, IconButton, Container, Chip, Card,
    CardContent, Grid, Tooltip, Avatar, Divider
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
                                                                    sx={{
                                                                        color: '#f44336',
                                                                        '&:hover': {
                                                                            backgroundColor: '#ffebee'
                                                                        }
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
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
        </Box>
    );
};

export default Projects;
