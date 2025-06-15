import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: Replace with actual AWS Cognito URL
        const cognitoUrl = process.env.REACT_APP_COGNITO_URL || 'https://your-cognito-domain.auth.region.amazoncognito.com';

        // Redirect to Cognito login
        window.location.href = cognitoUrl;
    }, []);

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f4f5f7'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Redirecting to Login...
                    </Typography>
                    <CircularProgress />
                </Box>
            </Container>
        </Box>
    );
}

export default Home; 