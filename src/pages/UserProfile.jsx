import { useState } from 'react';
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
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function UserSettings() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settings, setSettings] = useState({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Software Engineer',
        department: 'Engineering',
        organization: 'Tech Corp',
    });

    const handleInputChange = (field) => (event) => {
        setSettings({
            ...settings,
            [field]: event.target.value,
        });
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving settings:', settings);
    };

    const disabledFieldStyle = {
        backgroundColor: '#f5f5f5',
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#666666',
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
                        <Typography variant="h4" gutterBottom>
                            User Settings
                        </Typography>
                        <Grid container spacing={3}>
                            {/* Profile Section */}
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
                                    <Typography variant="h6">{`${settings.firstName} ${settings.lastName}`}</Typography>
                                    <Typography color="textSecondary">{settings.role}</Typography>
                                </Paper>
                            </Grid>

                            {/* Settings Form */}
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
                                                value={settings.firstName}
                                                onChange={handleInputChange('firstName')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={settings.lastName}
                                                onChange={handleInputChange('lastName')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                value={settings.email}
                                                disabled
                                                InputProps={{
                                                    sx: disabledFieldStyle
                                                }}
                                                helperText="Email cannot be changed"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Role"
                                                value={settings.role}
                                                disabled
                                                InputProps={{
                                                    sx: disabledFieldStyle
                                                }}
                                                helperText="Role cannot be changed"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Department"
                                                value={settings.department}
                                                disabled
                                                InputProps={{
                                                    sx: disabledFieldStyle
                                                }}
                                                helperText="Department cannot be changed"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Organization"
                                                value={settings.organization}
                                                disabled
                                                InputProps={{
                                                    sx: disabledFieldStyle
                                                }}
                                                helperText="Organization cannot be changed"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSave}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default UserSettings; 