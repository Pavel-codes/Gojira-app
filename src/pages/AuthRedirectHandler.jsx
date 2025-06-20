import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getUrlParameters() {
  return Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)));
}

function AuthRedirectHandler() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = getUrlParameters();
    const idToken = params.id_token;

    if (idToken) {
      try {
        const decoded = JSON.parse(atob(idToken.split('.')[1]));
        const groups = (decoded['cognito:groups'] || []).map(g => g.toLowerCase());

        console.log("Decoded token:", decoded);
        console.log("Groups:", groups);

        loginWithToken(idToken);

        const isAdmin = groups.includes('admins');
        const destination = isAdmin ? '/admindashboard' : '/dashboard';

        navigate(destination, { replace: true });
      } catch (err) {
        console.error('Token decode failed:', err);
        navigate('/login', { replace: true }); // only hit if something goes wrong decoding
      }
    } else {
      console.warn("Missing id_token in redirect URL.");
      navigate('/login', { replace: true }); // hit if Cognito didn't provide token
    }
  }, [navigate, loginWithToken]);

  return null;
}

export default AuthRedirectHandler;
