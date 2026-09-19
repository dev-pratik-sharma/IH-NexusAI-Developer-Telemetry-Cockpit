import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Unified global project deletion modal states
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  
  // Strict initialization prevents unauthenticated route dashboard bypass jumps
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: '', email: '', avatarColor: '' });
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default loading locks screen until auth verify completes

  const API_BASE = 'https://ih-nexusai-developer-telemetry-cockpit.onrender.com/api';

  const modernGradients = [
    'from-indigo-500 to-purple-600',
    'from-emerald-400 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-400 to-orange-600',
    'from-cyan-500 to-blue-600'
  ];

  // REAL-TIME AUTO SESSION RECOVERY: Retains true profile variables across page refreshes cleanly
  useEffect(() => {
    const checkExistingSession = async () => {
      const existingToken = localStorage.getItem('nexus_token');
      if (!existingToken) {
        setIsLoading(false); // Bypasses loop instantly to drop logged-out visitor onto login portal forms
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${existingToken}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // FIXED: Saves the custom backend name/email columns securely instead of placeholders
          setUserProfile({
            name: data.user.name || 'Developer Node',
            email: data.user.email || 'dev@nexus.ai',
            avatarColor: modernGradients[Math.floor(Math.random() * modernGradients.length)]
          });
          setIsLoggedIn(true); // Grants layout panel entry clearance
        } else {
          localStorage.removeItem('nexus_token'); // Wipes expired or forged keys
        }
      } catch (err) {
        console.error("Auto-session restoration bypassed:", err);
      } finally {
        setIsLoading(false); // Fades away the frosted loader screen layer safely
      }
    };

    checkExistingSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDatabaseData();
    }
  }, [isLoggedIn]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('nexus_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDatabaseData = async () => {
    try {
      const resProjects = await fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() });
      const dataProjects = await resProjects.json();
      
      const verifiedProjects = (Array.isArray(dataProjects) ? dataProjects : []).map(p => ({
        id: p.id || p.Id,
        name: p.name || p.Name,
        category: p.category || p.Category,
        progress: p.progress !== undefined ? p.progress : (p.Progress || 0)
      }));
      setProjects(verifiedProjects);

      const resTasks = await fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() });
      const dataTasks = await resTasks.json();
      
      const verifiedTasks = (Array.isArray(dataTasks) ? dataTasks : []).map(t => ({
        id: t.id || t.Id,
        title: t.title || t.Title,
        status: t.status || t.Status,
        priority: t.priority || t.Priority,
        ProjectId: t.project_id || t.ProjectId || t.ProjectId
      }));
      
      const mappedTasks = verifiedTasks.map(task => {
        if (!task.project) {
          const targetProjId = task.ProjectId || task.project_id;
          const matchedProj = verifiedProjects.find(p => parseInt(p.id) === parseInt(targetProjId));
          task.project = matchedProj ? matchedProj.name : 'Unassigned Suite';
        }
        return task;
      });
      setTasks(mappedTasks);
    } catch (err) {
      console.error("Failed to synchronize relational API strings:", err);
    }
  };

    const addNewProject = async (name, category) => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, category, progress: 0 })
      });
      if (response.ok) {
        await fetchDatabaseData();
        return true;
      }
    } catch (error) {
      console.error("Failed to push new project node:", error);
    }
    return false;
  };

  // FIXED RELATIONAL DELETE LINK: Unifies both dashboards to hit the exact same server deletion thread
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      const response = await fetch(`${API_BASE}/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setProjectToDelete(null); 
        await fetchDatabaseData(); 
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error("Deletion sequence blocked:", err);
    } finally {
      setIsDeletingProject(false);
      setProjectToDelete(null);
    }
  };

  const addNewTask = async (title, priority, projectId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, priority, status: 'todo', ProjectId: parseInt(projectId) })
      });
      if (response.ok) {
        await fetchDatabaseData();
        return true;
      }
    } catch (error) {
      console.error("Failed to commit new task entry:", error);
    }
    return false;
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        await fetchDatabaseData();
      }
    } catch (error) {
      console.error("Failed to patch operational state:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    setIsLoggedIn(false);
    setTasks([]);
    setProjects([]);
    setProjectFilter('all');
    setShowLogoutModal(false);
  };

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      activeTab, setActiveTab,
      statusFilter, setStatusFilter,
      projectFilter, setProjectFilter,
      showLogoutModal, setShowLogoutModal,
      projectToDelete, setProjectToDelete,
      isDeletingProject, handleConfirmDeleteProject,
      isLoggedIn, setIsLoggedIn,
      userProfile, setUserProfile,
      projects, tasks, isLoading,
      addNewProject, addNewTask, toggleTaskStatus, handleLogout, fetchDatabaseData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
