import { AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase, Paper, Menu, MenuItem, ListSubheader, Divider, ListItemIcon, ListItemText, Avatar, Chip, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/PersonOutline';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowDown from '@mui/icons-material/ArrowDropDown';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';

import { Link, useNavigate } from 'react-router-dom';
import { use, useState, useEffect } from 'react';
import { useCreate } from '../context/CreateContext';
import { useSidebar } from '../context/SidebarContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const Navbar = () => {
    const { handleCreateClick } = useCreate();
    const { toggleSidebar } = useSidebar();
    const { openAddProjectModal } = useProject();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [peopleAnchorEl, setPeopleAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const peopleOpen = Boolean(peopleAnchorEl);
    const profileOpen = Boolean(profileAnchorEl);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const usersApiUrl = config.apiBaseUrl + config.endpoints.users;

    const starredProjects = [
        { id: 1, name: 'Attack Stack', key: 'ATCK', starred: true, icon: <FolderIcon sx={{ color: '#4caf50' }} /> },
    ];
    const recentProjects = [
        { id: 2, name: 'Platform', key: 'PLAT', starred: false, icon: <FolderIcon sx={{ color: '#1976d2' }} /> },
    ];
    const orgName = 'TechNova'; // This should be dynamically set based on the logged-in user's organization
    
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

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePeopleMenuOpen = (event) => {
        setPeopleAnchorEl(event.currentTarget);
    };
    const handlePeopleMenuClose = () => {
        setPeopleAnchorEl(null);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleProfileMenuClose();
    };

    const handleMenuClick = () => {
        toggleSidebar();
    };

    return (
        <AppBar 
            position="static" 
            color="default" 
            elevation={0} 
            sx={{ 
                zIndex: 1201,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
                {/* Menu Button */}
                <IconButton 
                    edge="start" 
                    color="inherit" 
                    aria-label="menu" 
                    sx={{ 
                        mr: 2,
                        color: '#666',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                            color: '#1976d2'
                        }
                    }} 
                    onClick={handleMenuClick}
                >
                    <MenuIcon />
                </IconButton>

                {/* Logo */}
                <Typography
                    variant="h5"
                    sx={{ 
                        fontWeight: 700,
                        mr: 4,
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }}
                    component={Link}
                    to="/dashboard"
                >
                    GoJira
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button 
                        color="inherit" 
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#666',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#1976d2'
                            }
                        }}
                    >
                        Your work
                        <ArrowDown sx={{ ml: 0.5, fontSize: 16 }} />
                    </Button>
                    
                    <Button 
                        color="inherit" 
                        onClick={handleMenuOpen} 
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#333',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#1976d2'
                            }
                        }}
                    >
                        PROJECTS
                        <ArrowDown sx={{ ml: 0.5, fontSize: 16 }} />
                    </Button>

                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/dashboard" 
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#666',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#1976d2'
                            }
                        }}
                    >
                        DASHBOARD
                    </Button>
                    
                    <Button 
                        color="inherit" 
                        onClick={handlePeopleMenuOpen} 
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#666',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#1976d2'
                            }
                        }}
                    >
                        PEOPLE
                        <ArrowDown sx={{ ml: 0.5, fontSize: 16 }} />
                    </Button>
                </Box>

                {/* Create Button */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ 
                        ml: 3,
                        mr: 2,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        }
                    }} 
                    onClick={handleCreateClick}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Search Bar */}
                <Paper 
                    component="form" 
                    sx={{ 
                        p: '4px 8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: { xs: 200, md: 300 },
                        mr: 2,
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                            borderColor: '#1976d2'
                        }
                    }}
                >
                    <SearchIcon sx={{ color: '#666', mr: 1 }} />
                    <InputBase 
                        sx={{ 
                            ml: 1, 
                            flex: 1,
                            fontSize: '0.875rem',
                            '& input::placeholder': {
                                color: '#999',
                                opacity: 1
                            }
                        }} 
                        placeholder="Search..." 
                        inputProps={{ 'aria-label': 'search' }} 
                    />
                </Paper>

                {/* Right Side Icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Notifications">
                        <IconButton
                            sx={{
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    color: '#1976d2'
                                }
                            }}
                        >
                            <NotificationsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton
                            sx={{
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    color: '#1976d2'
                                }
                            }}
                        >
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Profile Avatar */}
                    <Tooltip title="Profile">
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            sx={{
                                ml: 1,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.2s ease'
                                }
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 36, 
                                    height: 36,
                                    border: '2px solid #e0e0e0',
                                    '&:hover': {
                                        borderColor: '#1976d2'
                                    }
                                }}
                                src="https://www.gravatar.com/avatar?d=mp"
                                alt="avatar"
                            />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Projects Menu */}
                <Menu 
                    anchorEl={anchorEl} 
                    open={open} 
                    onClose={handleMenuClose} 
                    PaperProps={{ 
                        sx: { 
                            width: 320, 
                            p: 0,
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0'
                        } 
                    }}
                >
                    <ListSubheader sx={{ 
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#333',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        Starred
                    </ListSubheader>
                    {starredProjects.map((project) => (
                        <MenuItem 
                            key={project.id} 
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <ListItemIcon>{project.icon}</ListItemIcon>
                            <ListItemText 
                                primary={project.name + ' (' + project.key + ')'} 
                                secondary="Software project"
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                            <StarIcon sx={{ color: '#fbc02d', ml: 1 }} fontSize="small" />
                        </MenuItem>
                    ))}
                    <Divider />
                    <ListSubheader sx={{ 
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#333',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        Recent
                    </ListSubheader>
                    {recentProjects.map((project) => (
                        <MenuItem 
                            key={project.id} 
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <ListItemIcon>{project.icon}</ListItemIcon>
                            <ListItemText 
                                primary={project.name + ' (' + project.key + ')'} 
                                secondary="Software project"
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                            <StarBorderIcon sx={{ color: '#bdbdbd', ml: 1 }} fontSize="small" />
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem 
                        onClick={handleMenuClose} 
                        component={Link} 
                        to="/projects"
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        <ListItemText primary="View all projects" />
                    </MenuItem>
                    <MenuItem 
                        onClick={() => { handleMenuClose(); openAddProjectModal(); }}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        <ListItemIcon><AddIcon /></ListItemIcon>
                        <ListItemText primary="Create project" />
                    </MenuItem>
                </Menu>

                {/* People Menu */}
                <Menu 
                    anchorEl={peopleAnchorEl} 
                    open={peopleOpen} 
                    onClose={handlePeopleMenuClose} 
                    PaperProps={{ 
                        sx: { 
                            width: 320, 
                            p: 0,
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0'
                        } 
                    }}
                >
                    <ListSubheader sx={{ 
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#333',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        My Team
                    </ListSubheader>
                    <Divider />
                    {users.map((person) => (
                        <MenuItem 
                            key={person.id} 
                            onClick={handlePeopleMenuClose}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {person.name?.charAt(0) || 'U'}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                                primary={person.name} 
                                secondary={person.email}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                            <Chip 
                                label={person.role} 
                                size="small" 
                                sx={{ 
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    fontSize: '0.7rem'
                                }}
                            />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Profile Menu */}
                <Menu
                    id="profile-menu"
                    anchorEl={profileAnchorEl}
                    open={profileOpen}
                    onClose={handleProfileMenuClose}
                    MenuListProps={{ 'aria-labelledby': 'profile-button' }}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e0e0e0',
                            minWidth: 200
                        }
                    }}
                >
                    <MenuItem 
                        onClick={handleProfileMenuClose} 
                        component={Link} 
                        to="/profile"
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                        onClick={handleLogout}
                        sx={{
                            color: '#f44336',
                            '&:hover': {
                                backgroundColor: '#ffebee'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
