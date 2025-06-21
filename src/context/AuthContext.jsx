import { createContext, useContext, useState } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });


    const isAuthenticated = !!user;
    const groups = (user?.['cognito:groups'] || []).map(g => g.toLowerCase());
    const isAdmin = groups.includes('admins'); // ← match exact string
    const orgName = user?.['custom:organization'] || user?.organization || null;

    const loginWithToken = (idToken) => {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        sessionStorage.setItem('user', JSON.stringify(payload));
        setUser(payload);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, orgName, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
