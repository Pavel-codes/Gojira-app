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
    const [userGroup, setUserGroup] = useState('Admins'); // optionally get this from JWT

    const availableRoles = ['User', 'Developer', 'Admin'];

    const [newUser, setNewUser] = useState({
        name: '',
        family_name: '',
        email: '',
        role: 'User',
        organization: orgName,
        username: '',
        temporaryPassword: ''
    });

    const usersApiUrl = config.apiBaseUrl + config.endpoints.usersUser;
    const fetchUsersApiUrl = config.apiBaseUrl + config.endpoints.users;

    const fetchUsersFromAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${fetchUsersApiUrl}?orgName=${encodeURIComponent(orgName)}`);
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
                name: user.name,
                family_name: user.family_name,
                email: user.email,
                role: user.role,
                organization: user.organization,
                username: user.username || '',
                temporaryPassword: ''
            });
        } else {
            setIsEditing(false);
            setEditingId(null);
            setNewUser({
                name: '',
                family_name: '',
                email: '',
                role: 'User',
                organization: orgName,
                username: '',
                temporaryPassword: ''
            });
        }
        setUserDialogOpen(true);
    };

    const handleUserDialogClose = () => {
        setUserDialogOpen(false);
        setNewUser({
            name: '',
            family_name: '',
            email: '',
            role: 'User',
            organization: orgName,
            username: '',
            temporaryPassword: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleCreateUser = async () => {
        const payload = {
            email: newUser.email,
            name: newUser.name,
            family_name: newUser.family_name,
            role: newUser.role,
            organization: newUser.organization,
            username: newUser.username,
            temporaryPassword: newUser.temporaryPassword
        };

        console.log('Creating user with payload:', JSON.stringify(payload));

        try {
            const response = await fetch(usersApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create user');

            await fetchUsersFromAPI();
            handleUserDialogClose();
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user');
        }
    };

    const handleUpdateUser = async () => {
        const payload = {
            name: newUser.name,
            family_name: newUser.family_name,
            email: newUser.email,
            role: newUser.role,
            organization: newUser.organization,
            username: newUser.username,
            temporaryPassword: newUser.temporaryPassword
        };

        try {
            const response = await fetch(`${usersApiUrl}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify(payload)
                })
            });

            if (!response.ok) throw new Error('Failed to update user');

            await fetchUsersFromAPI();
            handleUserDialogClose();
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${usersApiUrl}/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify({ userId })
                })
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
                    {userGroup === 'Admins' && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleUserDialogOpen()}>
                            New User
                        </Button>
                    )}
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
                                            {userGroup === 'Admins' && (
                                                <>
                                                    <IconButton size="small" color="primary" onClick={() => handleUserDialogOpen(user)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.userId)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
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
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            margin="dense"
                            value={newUser.family_name}
                            onChange={(e) => setNewUser({ ...newUser, family_name: e.target.value })}
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
                            select
                            label="Role"
                            fullWidth
                            margin="dense"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="dense"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                        <TextField
                            label="Temporary Password"
                            fullWidth
                            margin="dense"
                            type="password"
                            value={newUser.temporaryPassword}
                            onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                            required
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleUserDialogClose}>Cancel</Button>
                        <Button
                            onClick={isEditing ? handleUpdateUser : handleCreateUser}
                            variant="contained"
                            disabled={
                                !newUser.name ||
                                !newUser.family_name ||
                                !newUser.email ||
                                !newUser.username ||
                                !newUser.temporaryPassword
                            }
                        >
                            {isEditing ? 'Save Changes' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default Users;
