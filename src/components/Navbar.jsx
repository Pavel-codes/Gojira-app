import { AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase, Paper, Menu, MenuItem, ListSubheader, Divider, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
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
        { id: 1, name: 'Attack Stack', key: 'ATCK', starred: true, icon: <FolderIcon sx={{ color: 'green' }} /> },
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

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ zIndex: 1201 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 'bold', mr: 3 }}
                    component={Link}
                    to="/dashboard"
                    style={{ textDecoration: 'none', color: '#1976d2' }}
                >
                    GoJira
                </Typography>
                <Button color="inherit">Your work</Button>
                <Button color="inherit" onClick={handleMenuOpen} sx={{ textTransform: 'none' }}>PROJECTS</Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { width: 300, p: 0 } }}>
                    <ListSubheader>Starred</ListSubheader>
                    {starredProjects.map((project) => (
                        <MenuItem key={project.id} onClick={handleMenuClose}>
                            <ListItemIcon>{project.icon}</ListItemIcon>
                            <ListItemText primary={project.name + ' (' + project.key + ')'} secondary="Software project" />
                            <StarIcon sx={{ color: '#fbc02d', ml: 1 }} fontSize="small" />
                        </MenuItem>
                    ))}
                    <Divider />
                    <ListSubheader>Recent</ListSubheader>
                    {recentProjects.map((project) => (
                        <MenuItem key={project.id} onClick={handleMenuClose}>
                            <ListItemIcon>{project.icon}</ListItemIcon>
                            <ListItemText primary={project.name + ' (' + project.key + ')'} secondary="Software project" />
                            <StarBorderIcon sx={{ color: '#bdbdbd', ml: 1 }} fontSize="small" />
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleMenuClose} component={Link} to="/projects">
                        <ListItemText primary="View all projects" />
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); openAddProjectModal(); }}>
                        <ListItemIcon><AddIcon /></ListItemIcon>
                        <ListItemText primary="Create project" />
                    </MenuItem>
                </Menu>
                <Button color="inherit" component={Link} to="/dashboard" sx={{ textTransform: 'none' }}>DASHBOARD</Button>
                <Button color="inherit" onClick={handlePeopleMenuOpen} sx={{ textTransform: 'none' }}>PEOPLE</Button>
                <Menu anchorEl={peopleAnchorEl} open={peopleOpen} onClose={handlePeopleMenuClose} PaperProps={{ sx: { width: 300, p: 0 } }}>
                    <ListSubheader>My Team</ListSubheader>
                    <Divider />

                    {users.map((person) => (
                        <MenuItem key={person.id} onClick={handlePeopleMenuClose}>
                            <ListItemIcon><PeopleIcon></PeopleIcon></ListItemIcon>
                            <ListItemText primary={person.name} secondary={person.email} />
                            <ListItemText secondary={person.role} />
                            {/* <StarIcon sx={{ color: '#fbc02d', ml: 1 }} fontSize="small" /> */}
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handlePeopleMenuClose} component={Link} to="/users">
                        <ListItemText primary="View all people" />
                    </MenuItem>
                    <MenuItem onClick={() => { handlePeopleMenuClose(); navigate('/users/new'); }}>
                        <ListItemIcon><AddIcon /></ListItemIcon>
                        <ListItemText primary="Add person" />
                    </MenuItem>
                </Menu>
                <Button variant="contained" color="primary" sx={{ ml: 2, mr: 2 }} onClick={handleCreateClick}>Create</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200, mr: 2 }}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    aria-controls={profileOpen ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={profileOpen ? 'true' : undefined}
                >
                    <img src="https://www.gravatar.com/avatar?d=mp" alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                </IconButton>
                <Menu
                    id="profile-menu"
                    anchorEl={profileAnchorEl}
                    open={profileOpen}
                    onClose={handleProfileMenuClose}
                    MenuListProps={{ 'aria-labelledby': 'profile-button' }}
                >
                    <MenuItem onClick={handleProfileMenuClose} component={Link} to="/profile">
                        Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
