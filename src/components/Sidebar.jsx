import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

const sidebarWidth = 240;

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar();
    const { user, orgName, isAdmin } = useAuth();
    const location = useLocation();

    const menuItems = isAdmin 
        ? [{ text: 'Board', icon: <AssignmentIcon />, path: '/board' }]
        : [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'Backlog', icon: <ListAltIcon />, path: '/backlog' },
            // { text: 'Board', icon: <AssignmentIcon />, path: '/board' },
            // { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
            { text: 'Team', icon: <PeopleIcon />, path: '/team' },
            { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
        ];

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            sx={{
                width: sidebarWidth,
                bgcolor: '#1976d2',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1200,
                transform: isSidebarOpen ? 'translateX(0)' : `translateX(-100%)`,
                opacity: isSidebarOpen ? 1 : 0,
                visibility: isSidebarOpen ? 'visible' : 'hidden',
                pointerEvents: isSidebarOpen ? 'auto' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 3,
                borderBottom: '1px solid #1565c0',
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'white',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                }}>
                    G
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    GoJira
                </Typography>
            </Box>

            {/* User Info (Hidden for Admins) */}
            {!isAdmin && (
                <Box sx={{
                    p: 2,
                    borderBottom: '1px solid #1565c0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Avatar 
                        sx={{ 
                            width: 36, 
                            height: 36,
                            bgcolor: 'white',
                            color: '#1976d2'
                        }}
                        src="https://www.gravatar.com/avatar?d=mp"
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                            {user?.profile ? `${user.profile.name} ${user.profile.family_name}` : 'Loading...'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e3f2fd' }}>
                            {user?.profile?.role}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Navigation */}
            <Box sx={{ p: 1, mt: 1 }}>
                <List sx={{ p: 0 }}>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                mx: 0.5,
                                color: isActive(item.path) ? 'white' : '#e3f2fd',
                                bgcolor: isActive(item.path) ? '#1565c0' : 'transparent',
                                '&:hover': {
                                    bgcolor: isActive(item.path) ? '#1565c0' : '#42a5f5',
                                    color: 'white'
                                },
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                                minHeight: 48
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{
                                    fontWeight: isActive(item.path) ? 600 : 400,
                                    fontSize: '0.9rem'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Footer */}
            <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                p: 2,
                borderTop: '1px solid #1565c0',
                bgcolor: '#1976d2'
            }}>
                <Typography variant="caption" sx={{ color: '#e3f2fd', display: 'block', textAlign: 'center' }}>
                    GoJira v1.0
                </Typography>
            </Box>
        </Box>
    );
};

export default Sidebar;
