import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import config from '../config';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const organizationsApiUrl = config.apiBaseUrl + config.endpoints.organizations;
    const usersApiUrl = config.apiBaseUrl + config.endpoints.users;
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Dialog States
    const [orgDialogOpen, setOrgDialogOpen] = useState(false);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form States
    const [newOrg, setNewOrg] = useState({ name: '' });
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        organization: '',
        role: 'User',
        status: 'Active'
    });
    const fetchOrganizationsFromAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch(organizationsApiUrl);
            if (!response.ok) throw new Error(`Org fetch failed: ${response.status}`);
            const data = await response.json();
            console.log('Organizations:', data);
            setOrganizations(data); // Assuming API returns an array of orgs
        } catch (err) {
            console.error('Error fetching organizations:', err);
            setError('Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    // const fetchUsersForOrg = async (orgName) => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch(`${usersApiUrl}?orgName=${encodeURIComponent(orgName)}`);
    //         if (!response.ok) throw new Error(`User fetch failed: ${response.status}`);
    //         const data = await response.json();
    //         console.log('Users for', orgName, ':', data);
    //         setUsers(data); // or however you store/display users
    //     } catch (err) {
    //         console.error('Error fetching users:', err);
    //         setError('Failed to fetch users for organization');
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    useEffect(() => {
        fetchOrganizationsFromAPI();
        // fetchUsersFromAPI('TechNova');
    }, []);

    // Organization Handlers
    const handleOrgDialogOpen = (org = null) => {
        if (org) {
            setIsEditing(true);
            setEditingId(org.id);
            setNewOrg({ name: org.name });
        } else {
            setIsEditing(false);
            setEditingId(null);
            setNewOrg({ name: '' });
        }
        setOrgDialogOpen(true);
    };

    const handleOrgDialogClose = () => {
        setOrgDialogOpen(false);
        setNewOrg({ name: '' });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleCreateOrg = async () => {
        if (isEditing) {
            setOrganizations(orgs => orgs.map(org =>
                org.id === editingId ? { ...org, name: newOrg.name } : org
            ));
        } else {
            try {
                const response = await fetch(organizationsApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orgName: newOrg.name, users: [] })
                });

                if (!response.ok) {
                    throw new Error(`Failed to create organization. Status: ${response.status}`);
                }

                await fetchOrganizationsFromAPI();
            } catch (err) {
                console.error('Error creating organization:', err);
                setError('Failed to create organization');
            }
        }
        handleOrgDialogClose();
    };

    const handleDeleteOrg = (orgId) => {
        if (window.confirm('Are you sure you want to delete this organization? This will also delete all associated users.')) {
            setOrganizations(orgs => orgs.filter(org => org.id !== orgId));
            setUsers(users => users.filter(user => user.organization !== organizations.find(org => org.id === orgId)?.name));
        }
    };

    // User Handlers
    const handleUserDialogOpen = (user = null) => {
        if (user) {
            setIsEditing(true);
            setEditingId(user.id);
            setNewUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                organization: user.organization,
                role: user.role,
                status: user.status
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                organization: '',
                role: 'User',
                status: 'Active'
            });
        }
        setUserDialogOpen(true);
    };

    const handleUserDialogClose = () => {
        setUserDialogOpen(false);
        setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            organization: '',
            role: 'User',
            status: 'Active'
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleCreateUser = () => {
        if (isEditing) {
            const oldUser = users.find(user => user.id === editingId);
            const newUserData = { ...newUser };

            // Update user
            setUsers(users => users.map(user =>
                user.id === editingId ? { ...user, ...newUserData } : user
            ));

            // Update organization user count if organization changed
            if (oldUser.organization !== newUserData.organization) {
                setOrganizations(orgs => orgs.map(org => {
                    if (org.name === oldUser.organization) {
                        return { ...org, users: org.users - 1 };
                    }
                    if (org.name === newUserData.organization) {
                        return { ...org, users: org.users + 1 };
                    }
                    return org;
                }));
            }
        } else {
            const newUserData = {
                id: users.length + 1,
                ...newUser
            };
            setUsers([...users, newUserData]);

            // Update organization user count
            setOrganizations(orgs => orgs.map(org =>
                org.name === newUser.organization
                    ? { ...org, users: org.users + 1 }
                    : org
            ));
        }
        handleUserDialogClose();
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const userToDelete = users.find(user => user.id === userId);
            setUsers(users => users.filter(user => user.id !== userId));
            // Update organization user count
            setOrganizations(orgs => orgs.map(org =>
                org.name === userToDelete.organization
                    ? { ...org, users: org.users - 1 }
                    : org
            ));
        }
    };

    const handleOrganizationChange = (e) => {
        setNewUser({
            ...newUser,
            organization: e.target.value
        });
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
                <Box sx={{
                    width: sidebarOpen ? '240px' : '0',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
                    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Admin Dashboard
                        </Typography>
                        {loading && <Typography>Loading...</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        {/* Organizations Section */}
                        <Paper sx={{ p: 3, mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Organizations</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOrgDialogOpen()}
                                >
                                    New Organization
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Users</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {organizations.map((org) => (
                                            <TableRow key={org.id}>
                                                <TableCell>{org.orgName}</TableCell>
                                                <TableCell>{org.users.length}</TableCell>
                                                <TableCell>{org.createdAt}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" color="primary" onClick={() => handleOrgDialogOpen(org)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteOrg(org.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Users Section */}
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Users</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleUserDialogOpen()}
                                >
                                    New User
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>First Name</TableCell>
                                            <TableCell>Last Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Organization</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.firstName}</TableCell>
                                                <TableCell>{user.lastName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.organization}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>{user.status}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" color="primary" onClick={() => handleUserDialogOpen(user)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* New Organization Dialog */}
                        <Dialog open={orgDialogOpen} onClose={handleOrgDialogClose}>
                            <DialogTitle>{isEditing ? 'Edit Organization' : 'Create New Organization'}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Organization Name"
                                    fullWidth
                                    value={newOrg.name}
                                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleOrgDialogClose}>Cancel</Button>
                                <Button onClick={handleCreateOrg} variant="contained">
                                    {isEditing ? 'Save Changes' : 'Create'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* New User Dialog */}
                        <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="sm" fullWidth>
                            <DialogTitle>
                                <Typography variant="h6" component="div">
                                    {isEditing ? 'Edit User' : 'Create New User'}
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={3} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="First Name"
                                            fullWidth
                                            value={newUser.firstName}
                                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Last Name"
                                            fullWidth
                                            value={newUser.lastName}
                                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            required
                                            type="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Organization</InputLabel>
                                            <Select
                                                value={newUser.organization}
                                                label="Organization"
                                                onChange={handleOrganizationChange}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300
                                                        }
                                                    }
                                                }}
                                            >
                                                {organizations.map((org) => (
                                                    <MenuItem key={org.id} value={org.name}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                            <Typography>{org.name}</Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {org.users} users
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={newUser.role}
                                                label="Role"
                                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            >
                                                <MenuItem value="Admin">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography>Admin</Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Full access to all features
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="User">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography>User</Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Standard user access
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, py: 2 }}>
                                <Button onClick={handleUserDialogClose}>Cancel</Button>
                                <Button
                                    onClick={handleCreateUser}
                                    variant="contained"
                                    disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.organization}
                                >
                                    {isEditing ? 'Save Changes' : 'Create'}
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