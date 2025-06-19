import { createContext, useState, useContext, useEffect } from 'react';
import config from '../config';

const apiUrl = config.apiBaseUrl + config.endpoints.users;
const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsersFromAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl, { method: 'GET' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (Array.isArray(data)) {
                const transformed = data.map(user => ({
                    id: user.userId,
                    email: user.email,
                    name: user.name,
                    familyName: user.family_name,
                    role: user.role,
                    organization: user.organization,
                    username: user.username,
                }));
                setUsers(transformed);
            } else {
                console.warn('❌ API response is not an array:', data);
                setError('No user data found in API response.');
            }
        } catch (error) {
            console.error('Error fetching users from API:', error);
            setError('Failed to fetch users from API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersFromAPI();
    }, []);

    return (
        <UsersContext.Provider value={{ users, loading, error, fetchUsersFromAPI }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) throw new Error('useUsers must be used within a UsersProvider');
    return context;
};
