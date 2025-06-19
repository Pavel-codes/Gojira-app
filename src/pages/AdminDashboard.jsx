// AdminDashboard.jsx
import { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Box, Button, Table,
    TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import config from '../config';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const organizationsApiUrl = config.apiBaseUrl + config.endpoints.organizations;
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orgDialogOpen, setOrgDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newOrg, setNewOrg] = useState({ name: '' });

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
        if (window.confirm('Are you sure you want to delete this organization?')) {
            setOrganizations(orgs => orgs.filter(org => org.id !== orgId));
        }
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
                        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

                        {loading && <Typography>Loading...</Typography>}
                        {error && <Typography color="error">{error}</Typography>}

                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Organizations</Typography>
                                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOrgDialogOpen()}>
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
                                                <TableCell>
                                                    <Link to={`/users/${org.orgName}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                        {org.orgName}
                                                    </Link>
                                                </TableCell>
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

                        {/* Organization Dialog */}
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
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminDashboard;
