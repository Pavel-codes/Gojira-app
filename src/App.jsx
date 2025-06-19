import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import Task from './pages/Task';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CreateProvider } from './context/CreateContext';
import { SidebarProvider } from './context/SidebarContext';
import { ProjectProvider } from './context/ProjectContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CreateProvider>
          <SidebarProvider>
            <ProjectProvider>
              <Router>
                <Routes>
                  {/* <Route path="/" element={<Home />} /> */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/backlog" element={<Backlog />} />
                  <Route path="/task/:id" element={<Task />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/settings" element={<UserSettings />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </ProjectProvider>
          </SidebarProvider>
        </CreateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
