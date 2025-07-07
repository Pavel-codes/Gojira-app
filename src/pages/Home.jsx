import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import config from '../config';
import GoJiraLogo from '../assets/GoJira.png';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = () => {
            const clientId = config.cognitoClientId;
            const domain = config.cognitoUrl;
            const redirectUri = config.cognitoRedirectUri;
            const responseType = 'token';
            const scopes = 'openid+email+profile';

            const cognitoUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
            window.location.href = cognitoUrl;
    };

    const handleDashboardRedirect = () => {
        if (user) {
            const groups = (user['cognito:groups'] || []).map(g => g.toLowerCase());
            const destination = groups.includes('admins') ? '/admindashboard' : '/dashboard';
            navigate(destination);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f8f9fa'
            }}>
                <Typography variant="h6" sx={{ color: '#6c757d' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#f8f9fa',
            py: 4
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <img src={GoJiraLogo} alt="GoJira Logo" style={{ width: '200px', height: 'auto', marginBottom: '16px' }} />
                    <Typography variant="h6" sx={{ 
                        color: '#6c757d',
                        maxWidth: 600,
                        lineHeight: 1.6
                    }}>
                        Task management and tracking solution - Demo project
                    </Typography>
                </Box>

                {user ? (
                    // Authenticated User View
                    <Box sx={{ textAlign: 'center' }}>
                        <Paper sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            maxWidth: 500,
                            mx: 'auto'
                        }}>
                            <Avatar sx={{ 
                                width: 60, 
                                height: 60, 
                                bgcolor: '#4caf50',
                                mx: 'auto',
                                mb: 2
                            }}>
                                {user.name?.[0] || user.email?.[0] || 'U'}
                            </Avatar>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 600, 
                                color: '#2c3e50',
                                mb: 1
                            }}>
                                Welcome back, {user.name || user.email}!
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#6c757d',
                                mb: 3
                            }}>
                                You're already logged in. Continue to your dashboard to manage your tasks and projects.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<DashboardIcon />}
                                onClick={handleDashboardRedirect}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                    }
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        </Paper>
                    </Box>
                ) : (
                    // Unauthenticated User View
                    <>
                        {/* Login Section */}
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Paper sx={{ 
                                p: 4, 
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                maxWidth: 500,
                                mx: 'auto'
                            }}>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 600, 
                                    color: '#2c3e50',
                                    mb: 2
                                }}>
                                    Get Started
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: '#6c757d',
                                    mb: 3
                                }}>
                                    Sign in to access your projects and start managing tasks with your team.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    onClick={handleLogin}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                        }
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Paper>
                        </Box>

                        {/* Features Grid */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 4, 
                            mb: 6,
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            justifyContent: 'center'
                        }}>
                            <Card sx={{ 
                                flex: { xs: '1 1 100%', sm: '1 1 33%' },
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                }
                            }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Avatar sx={{ 
                                        width: 60, 
                                        height: 60, 
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600, 
                                        color: '#2c3e50',
                                        mb: 1
                                    }}>
                                        Task Management
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                        Create, assign, and track tasks with ease. Monitor progress and deadlines efficiently.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ 
                                flex: { xs: '1 1 100%', sm: '1 1 33%' },
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                }
                            }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Avatar sx={{ 
                                        width: 60, 
                                        height: 60, 
                                        bgcolor: '#fff3e0',
                                        color: '#f57c00',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <PeopleIcon />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600, 
                                        color: '#2c3e50',
                                        mb: 1
                                    }}>
                                        Team Collaboration
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                        Work together seamlessly with your team. Share projects and coordinate efforts effectively.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ 
                                flex: { xs: '1 1 100%', sm: '1 1 33%' },
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                }
                            }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Avatar sx={{ 
                                        width: 60, 
                                        height: 60, 
                                        bgcolor: '#e8f5e8',
                                        color: '#4caf50',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <DashboardIcon />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600, 
                                        color: '#2c3e50',
                                        mb: 1
                                    }}>
                                        Project Dashboard
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                        Get a clear overview of your projects with intuitive dashboards and progress tracking.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
}

export default Home;