import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useUsers } from '../context/UsersContext';
import { useSidebar } from '../context/SidebarContext';

const Team = () => {
  const { users, loadingUsers, usersError } = useUsers();
  const { isSidebarOpen } = useSidebar();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar always at the top */}
      <Navbar />

      <Box sx={{ display: 'flex', flex: 1, bgcolor: '#f4f5f7' }}>
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            overflow: 'auto',
            transition: 'all 0.3s ease',
            marginLeft: isSidebarOpen ? '240px' : '0',
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              My Team
            </Typography>

            {loadingUsers && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {usersError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {usersError}
              </Alert>
            )}

            {!loadingUsers && users.length === 0 && !usersError && (
              <Typography variant="body1" sx={{ mt: 4 }}>
                No team members found.
              </Typography>
            )}

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, fontSize: 18 }}>
                        {user.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{ mt: 1, backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Team;
