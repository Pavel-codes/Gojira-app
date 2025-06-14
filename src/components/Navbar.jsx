import { AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick, onCreateClick }) => (
    <AppBar position="static" color="default" elevation={1} sx={{ zIndex: 1201 }}>
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={onMenuClick}>
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
            <Button color="inherit">Projects</Button>
            <Button color="inherit" component={Link} to="/dashboard" sx={{ textTransform: 'none' }}>DASHBOARD</Button>
            <Button color="inherit">People</Button>
            <Button variant="contained" color="primary" sx={{ ml: 2, mr: 2 }} onClick={onCreateClick}>Create</Button>
            <Box sx={{ flexGrow: 1 }} />
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200, mr: 2 }}>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            <IconButton color="inherit">
                <img src="https://www.gravatar.com/avatar?d=mp" alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            </IconButton>
        </Toolbar>
    </AppBar>
);

export default Navbar; 