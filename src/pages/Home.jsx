import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import config from '../config';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: Replace with actual AWS Cognito URL
        const clientId = config.cognitoClientId;
        const domain = config.cognitoUrl; 
        const redirectUri = config.cognitoRedirectUri;
        const responseType = 'token'; // or 'code' if using Authorization Code Flow
        const scopes = 'openid+email';
        // Redirect to Cognito login
        //const cognitoUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        const cognitoUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${redirectUri}`; // for debugging
        
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!add 2 different login redirections based on signed in user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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