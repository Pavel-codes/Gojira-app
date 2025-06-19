// Users.jsx
import { useEffect, useState } from 'react';
import {
    Box, Container, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import config from '../config';

function Users() {
    const { orgName } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'User'
    });

    const usersApiUrl = config.apiBaseUrl + config.endpoints.users;

    const fetchUsersFromAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${usersApiUrl}?orgName=${encodeURIComponent(orgName)}`);
            if (!response.ok) throw new Error(`User fetch failed: ${response.status}`);
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('No users in this org', err);
            setError('No users found for this organization');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orgName) {
            fetchUsersFromAPI();
        }
    }, [orgName]);

    const handleUserDialogOpen = (user = null) => {
        if (user) {
            setIsEditing(true);
            setEditingId(user.userId);
            setNewUser({
                firstName: user.name,
                lastName: user.family_name,
                email: user.email,
                role: user.role,
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                role: 'User'
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
            role: 'User'
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleCreateOrUpdateUser = async () => {
        const payload = {
            name: newUser.firstName,
            family_name: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            organization: orgName
        };

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${usersApiUrl}/${editingId}` : usersApiUrl;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} user`);
            }

            await fetchUsersFromAPI();
            handleUserDialogClose();
        } catch (error) {
            console.error('Error creating/updating user:', error);
            setError('Failed to save user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${usersApiUrl}/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Delete failed');
            await fetchUsersFromAPI();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">Users for Organization: {orgName}</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleUserDialogOpen()}>New User</Button>
                </Box>
                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                <Paper sx={{ p: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user.userId || `${user.email}-${index}`}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.family_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary" onClick={() => handleUserDialogOpen(user)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.userId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* User Dialog */}
                <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle variant="h6">
                        {isEditing ? 'Edit User' : 'Create New User'}
                    </DialogTitle>

                    <DialogContent>
                        <TextField
                            label="First Name"
                            fullWidth
                            margin="dense"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            required
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            margin="dense"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            required
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="dense"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                        />
                        <TextField
                            label="Role"
                            fullWidth
                            margin="dense"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUserDialogClose}>Cancel</Button>
                        <Button onClick={handleCreateOrUpdateUser} variant="contained" disabled={!newUser.firstName || !newUser.lastName || !newUser.email}>
                            {isEditing ? 'Save Changes' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default Users;
