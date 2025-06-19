
const config = {
    cognitoUrl: import.meta.env.VITE_COGNITO_URL,
    cognitoClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    cognitoRedirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
    apiBaseUrl: import.meta.env.VITE_API_GATEWAY_URL,
    endpoints: {
        tasks: '/Tasks',
        users: '/Users',
        projects: '/Project',
        organizations: '/Organization',
        comments: '/Tasks/Comments',
        tasksUser: '/Tasks/User',
        usersUser: '/Users/User',
    },
};

export default config;
