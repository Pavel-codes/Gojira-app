import { Box, Typography, Paper, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';

const Reports = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Navbar on top */}
            <Navbar />

            {/* Below navbar: sidebar + main content horizontally */}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Page content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        marginLeft: isSidebarOpen ? '240px' : '0',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 4 }}>
                        Reports
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Project Overview
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Team Performance
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Reports;
