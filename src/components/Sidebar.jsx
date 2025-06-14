import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <Box sx={{
            width: isSidebarOpen ? 240 : 0,
            bgcolor: 'background.paper',
            height: '100vh',
            borderRight: 1,
            borderColor: 'divider',
            p: isSidebarOpen ? 2 : 0,
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            opacity: isSidebarOpen ? 1 : 0,
            visibility: isSidebarOpen ? 'visible' : 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1200
        }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Banc.ly frontend</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Next-gen software project</Typography>
            <List>
                <ListItem>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Roadmaps" />
                </ListItem>
                <ListItem component={Link} to="/backlog" sx={{ color: 'inherit', textDecoration: 'none' }}>
                    <ListItemIcon><ListAltIcon /></ListItemIcon>
                    <ListItemText primary="Backlog" />
                </ListItem>
                <ListItem>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="Board" />
                </ListItem>
                <ListItem component={Link} to="/reports" sx={{ color: 'inherit', textDecoration: 'none' }}>
                    <ListItemIcon><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">You're in a next-gen project</Typography>
        </Box>
    );
};

export default Sidebar; 