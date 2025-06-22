import { createContext, useState, useContext, useEffect } from 'react';
import { useUsers } from './UsersContext';
import config from '../config';

const apiUrl = config.apiBaseUrl + config.endpoints.projects;
const ProjectContext = createContext(null);

const managers = ['user001', 'user002', 'user004']; // adjust to match actual users if needed

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { orgName } = useUsers();

    const [addOpen, setAddOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        tag: '',
        manager: managers[0],
        description: ''
    });

    const fetchProjectsFromAPI = async () => {
        if (!orgName) {
            console.warn('Organization name not available, skipping project fetch');
            return;
        }
        console.log('ProjectContext orgName:', orgName);
        setLoading(true);
        setError(null);
    
        const queryUrl = `${apiUrl}?orgName=${encodeURIComponent(orgName)}`;
    
        try {
            const response = await fetch(queryUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
            const data = await response.json();
    
            // ✅ Your data IS the array
            if (Array.isArray(data)) {
                const transformed = data.map(project => ({
                    id: project.projectId,
                    name: project.projectName,
                    tag: project.projectTag,
                    manager: project.projectManager,
                    description: project.description,
                    orgId: project.orgId,
                }));
                setProjects(transformed);
            } else {
                console.warn('❌ API response is not an array:', data);
                setError('No project data found in API response.');
            }
        } catch (error) {
            console.error('Error fetching projects from API:', error);
            setError('Failed to fetch projects from API.');
        } finally {
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        if (orgName) fetchProjectsFromAPI();
    }, [orgName]);

    const openAddProjectModal = () => setAddOpen(true);
    const closeAddProjectModal = () => setAddOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProject = async () => {
        const newEntry = {
            projectName: newProject.name,
            projectTag: newProject.tag || newProject.name.slice(0, 4).toUpperCase(),
            projectManager: newProject.manager,
            description: newProject.description,
            orgId: 'org001', // Replace with dynamic org ID if available
        };
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to add project. Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Successfully added project:', result);
    
            // Optionally refresh full list from server
            await fetchProjectsFromAPI();
    
            // Reset form and close modal
            setNewProject({ name: '', tag: '', manager: managers[0], description: '' });
            setAddOpen(false);
        } catch (error) {
            console.error('Error adding project:', error);
            setError('Failed to add project to server.');
        }
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            managers,
            addOpen,
            newProject,
            openAddProjectModal,
            closeAddProjectModal,
            handleInputChange,
            handleAddProject,
            loading,
            error
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error('useProject must be used within a ProjectProvider');
    return context;
};
