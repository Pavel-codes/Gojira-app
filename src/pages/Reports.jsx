import { Box, Typography, Paper, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../context/SidebarContext';

const Reports = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{
                flexGrow: 1,
                ml: isSidebarOpen ? '240px' : 0,
                transition: 'margin-left 0.3s ease'
            }}>
                <Navbar />
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>
                        Reports
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Project Overview
                                </Typography>
                                {/* Add your reports content here */}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Team Performance
                                </Typography>
                                {/* Add your reports content here */}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Reports; 