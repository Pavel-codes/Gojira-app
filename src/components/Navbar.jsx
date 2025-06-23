import {
    AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase, Paper, Menu,
    MenuItem, ListSubheader, Divider, ListItemIcon, ListItemText, Avatar, Chip, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/PersonOutline';
import ArrowDown from '@mui/icons-material/ArrowDropDown';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCreate } from '../context/CreateContext';
import { useSidebar } from '../context/SidebarContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext'; // NEW CONTEXT

const Navbar = () => {
    const { handleCreateClick } = useCreate();
    const { toggleSidebar } = useSidebar();
    const { openAddProjectModal,projects } = useProject();
    const { logout } = useAuth();
    const { users } = useUsers(); // NEW HOOK
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [peopleAnchorEl, setPeopleAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const peopleOpen = Boolean(peopleAnchorEl);
    const profileOpen = Boolean(profileAnchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handlePeopleMenuOpen = (event) => setPeopleAnchorEl(event.currentTarget);
    const handlePeopleMenuClose = () => setPeopleAnchorEl(null);
    const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setProfileAnchorEl(null);
    const handleLogout = () => {
        logout();
        navigate('/login');
        handleProfileMenuClose();
    };
    const handleMenuClick = () => toggleSidebar();
 
    return (
        
        <AppBar position="static" color="default" elevation={0}
            sx={{
                zIndex: 1201,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
            <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}
                    sx={{
                        mr: 2,
                        color: '#666',
                        '&:hover': { backgroundColor: '#f5f5f5', color: '#1976d2' }
                    }}>
                    <MenuIcon />
                </IconButton>

                <Typography variant="h5" component={Link} to="/dashboard"
                    sx={{
                        fontWeight: 700, mr: 4,
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        textDecoration: 'none', cursor: 'pointer'
                    }}>
                    GoJira
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button color="inherit" sx={activeNavButtonStyle}>MY WORK<ArrowDown sx={arrowIcon} /></Button>
                    <Button color="inherit" onClick={handleMenuOpen} sx={activeNavButtonStyle}>PROJECTS<ArrowDown sx={arrowIcon} /></Button>
                    <Button color="inherit" component={Link} to="/dashboard" sx={activeNavButtonStyle}>DASHBOARD</Button>
                    <Button color="inherit" onClick={handlePeopleMenuOpen} sx={activeNavButtonStyle}>PEOPLE<ArrowDown sx={arrowIcon} /></Button>
                </Box>

                <Button variant="contained" color="primary" onClick={handleCreateClick}
                    startIcon={<AddIcon />}
                    sx={{
                        ml: 3, mr: 2, px: 3, py: 1, borderRadius: 2,
                        textTransform: 'none', fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': { boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)' }
                    }}>
                    Create
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                <Paper component="form"
                    sx={{
                        p: '4px 8px', display: 'flex', alignItems: 'center',
                        width: { xs: 200, md: 300 }, mr: 2, borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)', borderColor: '#1976d2' }
                    }}>
                    <SearchIcon sx={{ color: '#666', mr: 1 }} />
                    <InputBase sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }} placeholder="Search..." />
                </Paper>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Notifications"><IconButton sx={iconStyle}><NotificationsIcon /></IconButton></Tooltip>
                    <Tooltip title="Help"><IconButton sx={iconStyle}><HelpIcon /></IconButton></Tooltip>
                    <Tooltip title="Profile"><IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1, '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s ease' } }}>
                        <Avatar sx={avatarStyle} src="https://www.gravatar.com/avatar?d=mp" />
                    </IconButton></Tooltip>
                </Box>

                {/* Projects Menu */}
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={menuProps}>
                    <ListSubheader sx={menuHeaderStyle}>{projects[0] ? projects[0].orgName:'No projects'} Projects</ListSubheader>
                    {projects.map(project => (
                        <MenuItem key={project.id} sx={menuItemStyle}>
                            <ListItemIcon><FolderIcon sx={{ color: '#1976d2' }} /></ListItemIcon>
                            <ListItemText primary={`${project.name} (${project.tag})`} secondary="Software project" primaryTypographyProps={{ fontWeight: 500 }} />
                          
                        </MenuItem>
                    ))}
                    <Divider />    
                    <MenuItem onClick={handleMenuClose} component={Link} to="/projects" sx={menuItemStyle}><ListItemText primary="View all projects" /></MenuItem>
                </Menu>

                {/* People Menu */}
                <Menu anchorEl={peopleAnchorEl} open={peopleOpen} onClose={handlePeopleMenuClose} PaperProps={menuProps}>
                    <ListSubheader sx={menuHeaderStyle}>My Team</ListSubheader>
                    <Divider />
                    {users.map((person) => (
                        <MenuItem key={person.id} sx={menuItemStyle}>
                            <ListItemIcon>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {person.name?.charAt(0) || 'U'}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={person.name} secondary={person.email} primaryTypographyProps={{ fontWeight: 500 }} />
                            <Chip label={person.role} size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '0.7rem' }} />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Profile Menu */}
                <Menu id="profile-menu" anchorEl={profileAnchorEl} open={profileOpen} onClose={handleProfileMenuClose} MenuListProps={{ 'aria-labelledby': 'profile-button' }} PaperProps={menuProps}>
                    <MenuItem onClick={handleProfileMenuClose} component={Link} to="/profile" sx={menuItemStyle}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Profile" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: '#f44336', '&:hover': { backgroundColor: '#ffebee' } }}>
                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

const navButtonStyle = {
    textTransform: 'none', fontWeight: 500, color: '#666',
    '&:hover': { backgroundColor: '#f5f5f5', color: '#1976d2' }
};
const activeNavButtonStyle = {
    ...navButtonStyle, fontWeight: 600, color: '#333'
};
const arrowIcon = { ml: 0.5, fontSize: 16 };
const iconStyle = { color: '#666', '&:hover': { backgroundColor: '#f5f5f5', color: '#1976d2' } };
const avatarStyle = {
    width: 36, height: 36, border: '2px solid #e0e0e0',
    '&:hover': { borderColor: '#1976d2' }
};
const menuProps = {
    sx: {
        width: 320, p: 0, borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e0e0e0'
    }
};
const menuItemStyle = {
    '&:hover': { backgroundColor: '#f5f5f5' }
};
const menuHeaderStyle = {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#333',
    borderBottom: '1px solid #e0e0e0'
};

export default Navbar;
