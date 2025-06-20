import { Box, Typography, Paper, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';

const Reports = () => {
    const { isSidebarOpen } = useSidebar();
    const sidebarWidth = 240;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Navbar on top */}
            <Navbar />

            {/* Below navbar: sidebar + main content horizontally */}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {/* Sidebar */}
                <Box
                    sx={{
                        width: isSidebarOpen ? `${sidebarWidth}px` : '0px',
                        transition: 'width 0.3s ease',
                        overflow: 'hidden',
                    }}
                >
                    <Sidebar />
                </Box>

                {/* Page content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: 'margin 0.3s ease',
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
