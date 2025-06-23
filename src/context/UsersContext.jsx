// context/UsersContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';
import { useAuth } from './AuthContext'; // <--- IMPORT useAuth

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const { user: loggedInUser, orgName } = useAuth(); // <--- USE useAuth TO GET loggedInUser and orgName

  const fetchUsersFromAPI = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`${config.apiBaseUrl + config.endpoints.users}?orgName=${encodeURIComponent(orgName)}`);
      if (!response.ok) throw new Error(`User fetch failed: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('No users in this org', err);
      setUsersError('No users found for this organization');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    // Skip API call if orgName is DefaultOrg or user name is Admin
    if (orgName && orgName !== "DefaultOrg" && loggedInUser?.name !== "Admin") {
      fetchUsersFromAPI();
    } else {
      console.log('Skipping users API call - orgName is DefaultOrg or user is Admin');
      setUsers([]);
      setLoadingUsers(false);
    }
  }, [orgName, loggedInUser?.name]); // Add loggedInUser.name as dependency

  return (
    <UsersContext.Provider value={{ users, loadingUsers, usersError, orgName }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);