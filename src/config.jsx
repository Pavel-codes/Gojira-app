
const config = {
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
