import { useEffect, useState } from 'react';
import {
    Box, Container, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

function Users() {
    const { orgName } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [userGroup, setUserGroup] = useState('Admins'); // optionally get this from JWT

    const availableRoles = ['Manager', 'Developer', 'Admin'];

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
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f4f5f7' }}>
            <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '2px solid #e9ecef', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/admin')}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                px: 3,
                                py: 1.2,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.18)'
                                }
                            }}
                        >
                            Return
                        </Button>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', flex: 1, ml: 2 }}>
                            Users for Organization: {orgName}
                        </Typography>
                        {userGroup === 'Admins' && (
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleUserDialogOpen()} sx={{ borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.10)' }}>
                                New User
                            </Button>
                        )}
                    </Box>
                    {loading && <Typography sx={{ my: 2 }}>Loading...</Typography>}
                    {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
                    <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, maxHeight: '70vh', mb: 2 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>First Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user.userId || `${user.email}-${index}`} hover sx={{ '&:hover': { backgroundColor: '#f5f7fa' } }}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.family_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 500, fontSize: '0.9rem' }}>{user.role}</Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* User Dialog */}
                <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="sm" fullWidth
                    PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}>
                    <DialogTitle variant="h6" sx={{ fontWeight: 600, borderBottom: '2px solid #e9ecef', pb: 2 }}>
                        {isEditing ? 'Edit User' : 'Create New User'}
                    </DialogTitle>

                    <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="First Name"
                            fullWidth
                            margin="dense"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            margin="dense"
                            value={newUser.family_name}
                            onChange={(e) => setNewUser({ ...newUser, family_name: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="dense"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            select
                            label="Role"
                            fullWidth
                            margin="dense"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            SelectProps={{ native: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Temporary Password"
                            fullWidth
                            margin="dense"
                            type="password"
                            value={newUser.temporaryPassword}
                            onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button onClick={handleUserDialogClose} sx={{ borderRadius: 2, fontWeight: 500 }}>Cancel</Button>
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
                            sx={{ borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.10)' }}
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
