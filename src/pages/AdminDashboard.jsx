import { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Box, Button, Table,
    TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Grid, Card, CardContent, Chip,
    Avatar, LinearProgress, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // New icon for Add User
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import config from '../config';

function AdminDashboard() {
    const { isSidebarOpen } = useSidebar();
    const organizationsApiUrl = config.apiBaseUrl + config.endpoints.organizations;
    const usersApiUrl = config.apiBaseUrl + config.endpoints.users; // Assuming a users endpoint
    const addUserApiUrl = config.apiBaseUrl + config.endpoints.usersUser;
    
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for Organization Dialog
    const [orgDialogOpen, setOrgDialogOpen] = useState(false);
    const [isEditingOrg, setIsEditingOrg] = useState(false);
    const [editingOrgId, setEditingOrgId] = useState(null);
    const [newOrg, setNewOrg] = useState({ name: '' });

    // State for User Dialog
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        name: '',
        family_name: '',
        role: '',
        organization: '',
        username: '',
        temporaryPassword: ''
    });

    const fetchOrganizationsFromAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch(organizationsApiUrl);
            if (!response.ok) throw new Error(`Org fetch failed: ${response.status}`);
            const data = await response.json();
            setOrganizations(data);
        } catch (err) {
            console.error('Error fetching organizations:', err);
            setError('Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizationsFromAPI();
    }, []);

    // Handlers for Organization Dialog
    const handleOrgDialogOpen = (org = null) => {
        if (org) {
            setIsEditingOrg(true);
            setEditingOrgId(org.id);
            setNewOrg({ name: org.orgName }); // Use orgName property
        } else {
            setIsEditingOrg(false);
            setEditingOrgId(null);
            setNewOrg({ name: '' });
        }
        setOrgDialogOpen(true);
    };

    const handleOrgDialogClose = () => {
        setOrgDialogOpen(false);
        setNewOrg({ name: '' });
        setIsEditingOrg(false);
        setEditingOrgId(null);
    };

    const handleCreateOrg = async () => {
        setError(null);
        if (isEditingOrg) {
            // Placeholder for PUT request for editing organization
            // In a real app, you would send a PUT request to update the organization
            try {
                const response = await fetch(`${organizationsApiUrl}/${editingOrgId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orgName: newOrg.name }) // Adjust payload as per your API
                });

                if (!response.ok) {
                    throw new Error(`Failed to update organization. Status: ${response.status}`);
                }
                await fetchOrganizationsFromAPI(); // Re-fetch to get updated data
            } catch (err) {
                console.error('Error updating organization:', err);
                setError('Failed to update organization');
            }
        } else {
            try {
                const response = await fetch(organizationsApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orgName: newOrg.name, users: [] }) // Ensure payload matches API expectation
                });

                if (!response.ok) {
                    throw new Error(`Failed to create organization. Status: ${response.status}`);
                }

                await fetchOrganizationsFromAPI(); // Re-fetch to get new organization
            } catch (err) {
                console.error('Error creating organization:', err);
                setError('Failed to create organization');
            }
        }
        handleOrgDialogClose();
    };

    const handleDeleteOrg = async (orgId) => {
        if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            try {
                const response = await fetch(`${organizationsApiUrl}/${orgId}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to delete organization. Status: ${response.status}`);
                }
                await fetchOrganizationsFromAPI(); // Re-fetch organizations after deletion
            } catch (err) {
                console.error('Error deleting organization:', err);
                setError('Failed to delete organization');
            }
        }
    };

    // Handlers for User Dialog
    const handleUserDialogOpen = () => {
        setNewUser({
            email: '',
            name: '',
            family_name: '',
            role: '',
            organization: '',
            username: '',
            temporaryPassword: ''
        });
        setUserDialogOpen(true);
    };

    const handleUserDialogClose = () => {
        setUserDialogOpen(false);
    };

    const handleCreateUser = async () => {
        setError(null);
        try {
            // Construct the inner body string
            const innerBody = JSON.stringify({
                email: newUser.email,
                name: newUser.name,
                family_name: newUser.family_name,
                role: newUser.role,
                organization: newUser.organization,
                username: newUser.username,
                temporaryPassword: newUser.temporaryPassword,
            });

            const requestPayload = {
                body: innerBody,
                requestContext: {
                    authorizer: {
                        claims: {
                            "cognito:groups": "Admins"
                        }
                    }
                }
            };

            const response = await fetch(addUserApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload) // Stringify the outer payload
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to read error message from response
                throw new Error(`Failed to create user. Status: ${response.status}. Message: ${errorData.message || 'Unknown error'}`);
            }

            // Optionally re-fetch organizations to update user count if the API updates the org.users array
            await fetchOrganizationsFromAPI();
            handleUserDialogClose();
        } catch (err) {
            console.error('Error creating user:', err);
            setError(`Failed to create user: ${err.message}`);
        }
    };

    const totalUsers = organizations.reduce((sum, org) => sum + (org.users?.length || 0), 0);
    const activeOrgs = organizations.length;

    // Filter out duplicate organization names for the dropdown
    const uniqueOrganizationNames = Array.from(new Set(organizations.map(org => org.orgName)));

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f8f9fa' }}>
                <Sidebar />
                <Box sx={{ 
                    flex: 1, 
                    p: 4, 
                    overflow: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                }}>
                    <Container maxWidth={false} sx={{ mt: 2, mb: 4, px: 0 }}>
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
                                    <AdminPanelSettingsIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        fontSize: { xs: '1.5rem', md: '2rem' }
                                    }}>
                                        Admin Dashboard
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#6c757d',
                                        mt: 0.5
                                    }}>
                                        Manage organizations and system settings
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    onClick={handleUserDialogOpen}
                                    startIcon={<PersonAddIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                                        bgcolor: '#4caf50',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                                            bgcolor: '#43a047'
                                        }
                                    }}
                                >
                                    Add New User
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={() => handleOrgDialogOpen()}
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
                                    New Organization
                                </Button>
                            </Box>
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
                                                    {activeOrgs}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Organizations
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
                                                    {totalUsers}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Total Users
                                                </Typography>
                                            </Box>
                                            <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                                                    {Math.round((totalUsers / Math.max(activeOrgs, 1)) * 10) / 10}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Avg Users/Org
                                                </Typography>
                                            </Box>
                                            <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                                                    100%
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    System Health
                                                </Typography>
                                            </Box>
                                            <AdminPanelSettingsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Loading and Error States */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress size={40} />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Organizations Table */}
                        <Paper sx={{ 
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ 
                                p: 3, 
                                borderBottom: '1px solid #e9ecef',
                                bgcolor: '#fafafa'
                            }}>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 600,
                                    color: '#2c3e50'
                                }}>
                                    Organizations Management
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                            <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Organization</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Users</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Created</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {organizations.map((org) => (
                                            <TableRow key={org.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ 
                                                            bgcolor: '#1976d2',
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {org.orgName?.charAt(0) || 'O'}
                                                        </Avatar>
                                                        <Link 
                                                            to={`/users/${org.orgName}`} 
                                                            style={{ 
                                                                textDecoration: 'none', 
                                                                color: '#1976d2',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {org.orgName}
                                                        </Link>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={org.users?.length || 0} 
                                                        size="small" 
                                                        sx={{ 
                                                            bgcolor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label="Active" 
                                                        size="small" 
                                                        sx={{ 
                                                            bgcolor: '#e8f5e8',
                                                            color: '#2e7d32',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleOrgDialogOpen(org)}
                                                            sx={{
                                                                color: '#1976d2',
                                                                '&:hover': {
                                                                    bgcolor: '#e3f2fd'
                                                                }
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleDeleteOrg(org.id)}
                                                            sx={{
                                                                color: '#f44336',
                                                                '&:hover': {
                                                                    bgcolor: '#ffebee'
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {organizations.length === 0 && !loading && (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        No organizations found. Create your first organization to get started.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Organization Dialog */}
                        <Dialog 
                            open={orgDialogOpen} 
                            onClose={handleOrgDialogClose}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    minWidth: 400
                                }
                            }}
                        >
                            <DialogTitle sx={{ 
                                fontWeight: 600,
                                borderBottom: '1px solid #e9ecef',
                                pb: 2
                            }}>
                                {isEditingOrg ? 'Edit Organization' : 'Create New Organization'}
                            </DialogTitle>
                            <DialogContent sx={{ pt: 3 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Organization Name"
                                    fullWidth
                                    value={newOrg.name}
                                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </DialogContent>
                            <DialogActions sx={{ p: 3, pt: 1 }}>
                                <Button 
                                    onClick={handleOrgDialogClose}
                                    sx={{ 
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleCreateOrg} 
                                    variant="contained"
                                    sx={{ 
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    {isEditingOrg ? 'Save Changes' : 'Create Organization'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* User Dialog */}
                        <Dialog 
                            open={userDialogOpen} 
                            onClose={handleUserDialogClose}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    minWidth: 500
                                }
                            }}
                        >
                            <DialogTitle sx={{ 
                                fontWeight: 600,
                                borderBottom: '1px solid #e9ecef',
                                pb: 2
                            }}>
                                Add New User
                            </DialogTitle>
                            <DialogContent sx={{ pt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            label="Username"
                                            fullWidth
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            label="First Name"
                                            fullWidth
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            label="Last Name"
                                            fullWidth
                                            value={newUser.family_name}
                                            onChange={(e) => setNewUser({ ...newUser, family_name: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: 'fit-content', minWidth: 135 }}>
                                            <InputLabel id="organization-select-label">Organization</InputLabel>
                                            <Select
                                                labelId="organization-select-label"
                                                id="organization-select"
                                                value={newUser.organization}
                                                label="Organization"
                                                onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                                            >
                                                {uniqueOrganizationNames.map((orgName) => (
                                                    <MenuItem key={orgName} value={orgName}>
                                                        {orgName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: 'fit-content', minWidth: 75 }}>
                                            <InputLabel id="role-select-label">Role</InputLabel>
                                            <Select
                                                labelId="role-select-label"
                                                id="role-select"
                                                value={newUser.role}
                                                label="Role"
                                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            >
                                                <MenuItem value="Admin">Admin</MenuItem>
                                                <MenuItem value="Developer">Developer</MenuItem>
                                                <MenuItem value="Manager">Manager</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            label="Temporary Password"
                                            type="password"
                                            fullWidth
                                            value={newUser.temporaryPassword}
                                            onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ p: 3, pt: 1 }}>
                                <Button 
                                    onClick={handleUserDialogClose}
                                    sx={{ 
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleCreateUser} 
                                    variant="contained"
                                    sx={{ 
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    Create User
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminDashboard;