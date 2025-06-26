import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import config from '../config'; // Ensure this file exports API base URL

function UserSettings() {
    const { isSidebarOpen } = useSidebar();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const usersApiUrl = config.apiBaseUrl + config.endpoints.usersUser;

    useEffect(() => {
        const fetchUserData = async () => {
            const loggedUser = JSON.parse(sessionStorage.getItem('user'));
            const userId = loggedUser.sub; // Assuming it's already stored on login
            // console.log('Debug - userId:', userId);

            if (!userId) {
                setError('User ID not found in session');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${usersApiUrl}?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setSettings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const handleInputChange = (field) => (event) => {
        setSettings({
            ...settings,
            [field]: event.target.value,
        });
    };

    const handleSave = ()  => {
        // TODO: Implement update logic (e.g. PUT to /Users/user)
        console.log('Saving settings:', settings);
    };

    const disabledFieldStyle = {
        backgroundColor: '#f5f5f5',
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#666666',
        }
    };
    console.log('settings', settings);
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
                <Sidebar />
                <Box sx={{ 
                    flex: 1, 
                    p: 4, 
                    overflow: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                }}>
                    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            User Profile
                        </Typography>

                        {loading && <CircularProgress />}
                        {error && <Alert severity="error">{error}</Alert>}
                        {!loading && settings && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                            <Avatar
                                                src="https://www.gravatar.com/avatar?d=mp"
                                                sx={{ width: 120, height: 120, mb: 2 }}
                                            />
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    backgroundColor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.dark',
                                                    },
                                                }}
                                            >
                                                <PhotoCamera />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="h6">{`${settings.username}`}</Typography>
                                        <Typography color="textSecondary">{settings.role}</Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Personal Information
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={settings.name || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="First name cannot be changed"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={settings.family_name || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="Last name cannot be changed"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={settings.email || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="Email cannot be changed"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    value={settings.role || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="Role cannot be changed"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Department"
                                                    value={settings.department || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="Department cannot be changed"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Organization"
                                                    value={settings.organization || ''}
                                                    disabled
                                                    InputProps={{ sx: disabledFieldStyle }}
                                                    helperText="Organization cannot be changed"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default UserSettings;
