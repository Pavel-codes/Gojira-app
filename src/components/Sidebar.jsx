import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const sidebarWidth = 180;

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <Box
            sx={{
                width: sidebarWidth,
                bgcolor: 'background.paper',
                height: '100vh',
                borderRight: 1,
                borderColor: 'divider',
                p: 1.5,
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1200,
                boxShadow: 3,
                transform: isSidebarOpen ? 'translateX(0)' : `translateX(-100%)`,
                opacity: isSidebarOpen ? 1 : 0,
                visibility: isSidebarOpen ? 'visible' : 'hidden',
                pointerEvents: isSidebarOpen ? 'auto' : 'none',
                transition: 'transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Banc.ly frontend</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', mt: 5 }}>
                Next-gen software project
            </Typography>
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
            <Typography variant="caption" color="text.secondary">
                You're in a next-gen project
            </Typography>
        </Box>
    );
};

export default Sidebar;
