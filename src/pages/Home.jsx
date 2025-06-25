import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsed = JSON.parse(user);
            const groups = (parsed['cognito:groups'] || []).map(g => g.toLowerCase());
            const destination = groups.includes('admins') ? '/admindashboard' : '/dashboard';
            navigate(destination);
        } else {
            const clientId = config.cognitoClientId;
            const domain = config.cognitoUrl;
            const redirectUri = config.cognitoRedirectUri;
            const responseType = 'token';
            const scopes = 'openid+email+profile';

            const cognitoUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
            window.location.href = cognitoUrl;
        }
    }, [navigate]);
    return null;
}

export default Home;