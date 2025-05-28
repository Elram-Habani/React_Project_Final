import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './views/pages/Home/Home';
import TaskManagement from './views/pages/TaskManagement/TaskManagement';
import HelpAndSettings from './views/pages/HelpAndSettings/HelpAndSettings';
import Statistics from './views/pages/Statistics/Statistics';
import UserManagement from './views/pages/UserManagement/UserManagement';
import Login from './views/pages/Login/Login';
import Register from './views/pages/Register/Register';
import './App.css'; 

function LogoutButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      התנתקות
    </button>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <Router>
      <LogoutButton />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<TaskManagement tasks={tasks} setTasks={setTasks} />} />
        <Route path="/help" element={<HelpAndSettings />} />
        <Route path="/statistics" element={<Statistics tasks={tasks} />} />
        <Route path="/users" element={<UserManagement tasks={tasks} />} />
      </Routes>
    </Router>
  );
}

export default App;
