import { createContext, useContext, useState, useEffect } from 'react';
import config from '../config'; // make sure this points to your actual config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAuthenticated = !!user;
    const groups = (user?.['cognito:groups'] || []).map(g => g.toLowerCase());
    const isAdmin = groups.includes('admins');
    const orgName = user?.['custom:organization'] || user?.organization || null;

    // const loginWithToken = (idToken) => {
    //     const payload = JSON.parse(atob(idToken.split('.')[1]));
    //     sessionStorage.setItem('user', JSON.stringify(payload));
    //     setUser(payload);
    // };

    const loginWithToken = (idToken) => {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        sessionStorage.setItem('user', JSON.stringify(payload));
        setUser(payload);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    // ✅ Load additional user profile from your backend
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || user.profile || !user.sub) return;

            try {
                const res = await fetch(`${config.apiBaseUrl}${config.endpoints.usersUser}?userId=${user.sub}`);
                if (!res.ok) throw new Error('Failed to fetch profile');
                const profile = await res.json();

                setUser(prev => ({
                    ...prev,
                    profile // ✅ attach backend profile to user
                }));
            } catch (err) {
                console.error('Error loading user profile:', err.message);
            }
        };

        fetchUserProfile();
    }, [user?.sub]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, orgName, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
