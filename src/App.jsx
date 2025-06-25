import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import Task from './pages/Task';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AuthRedirectHandler from './pages/AuthRedirectHandler.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import Team from './pages/Team.jsx';

import { AuthProvider } from './context/AuthContext';
import { CreateProvider } from './context/CreateContext';
import { SidebarProvider } from './context/SidebarContext';
import { ProjectProvider } from './context/ProjectContext';
import { UsersProvider } from './context/UsersContext';

// 🔵 MUI Theme
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
  // 🔁 Handle Cognito redirect to /index.html with token hash
  if (
    window.location.pathname === '/index.html' &&
    window.location.hash.includes('id_token=')
  ) {
    const newPath = '/auth-redirect' + window.location.hash;
    window.history.replaceState(null, '', newPath);
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UsersProvider>
          <ProjectProvider>
            <CreateProvider>
              <SidebarProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth-redirect" element={<AuthRedirectHandler />} />

                    {/* ✅ Protected Dashboard */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute onlyUser>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/backlog" element={<Backlog />} />
                    <Route path="/task/:id" element={<Task />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/settings" element={<UserSettings />} />

                    {/* ✅ Protected Admin Dashboard */}
                    <Route
                      path="/admindashboard"
                      element={
                        <ProtectedRoute onlyAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/users/:orgName" element={<Users />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </SidebarProvider>
            </CreateProvider>
          </ProjectProvider>
        </UsersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
