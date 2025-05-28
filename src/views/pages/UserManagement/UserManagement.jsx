import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import './UserManagement.css';

export default function UserManagement({ tasks }) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const displayName = currentUser.displayName || currentUser.email || 'משתמש';
        setName(displayName);
        setNewName(displayName);
      } else {
        setName('לא מחובר');
      }
    });

    return () => unsubscribe();
  }, []);

  const startEdit = () => {
    setNewName(name);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (newName.trim() && user) {
      try {
        await updateProfile(user, {
          displayName: newName.trim(),
        });
        setName(newName.trim());
        setEditing(false);
      } catch (error) {
        console.error("שגיאה בשמירת השם החדש:", error);
      }
    }
  };

  const deleteUser = () => {
    setIsDeleted(true);
  };

  const completedTasks = tasks?.filter((t) => t.status === 100) || [];
  const lastLogin = new Date().toLocaleString('he-IL');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  return (
    <div className="page">
      <h1 className="title">ניהול משתמשים</h1>

      <section className="section">
        <h3 className="label-green">המשתמש שלך:</h3>
        <ul className="user-list">
          {isDeleted ? (
            <li style={{ color: '#999' }}>⚠️ אין משתמש להצגה</li>
          ) : (
            <li>
              {editing ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ marginLeft: '8px', padding: '6px', borderRadius: '6px' }}
                  />
                  <button className="editBtn" onClick={saveEdit}>שמור</button>
                </>
              ) : (
                <>
                  <span style={{ marginLeft: 'auto' }}>⚫ {name}</span>
                  <button className="editBtn" onClick={startEdit}>ערוך</button>
                  <button className="deleteBtn" onClick={deleteUser}>מחק</button>
                </>
              )}
            </li>
          )}
        </ul>
      </section>

      <section className="section stats">
        <h3>סטטיסטיקה כללית</h3>
        <div className="stat-row">
          <span className="yellow">משימות שהושלמו:</span>
        </div>
        <ul className="user-list">
          {completedTasks.length === 0 ? (
            <li style={{ color: '#999' }}>אין משימות שהושלמו</li>
          ) : (
            completedTasks.map((task, index) => (
              <li key={index}>✅ {task.subject}</li>
            ))
          )}
        </ul>
      </section>

      <section className="section">
        <h3>הגדרות כלליות במערכת -</h3>
        <div className="action-row">
          <button className="pink" onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}>
            שינוי תצוגה
          </button>
          <button className="pink" onClick={() => setActiveSection(activeSection === 'system' ? null : 'system')}>
            פרטי המערכת
          </button>
          <button className="pink" onClick={() => setActiveSection(activeSection === 'login' ? null : 'login')}>
            מעקב כניסות
          </button>
        </div>

        {activeSection === 'theme' && (
          <div className="theme-options" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#fff8f8', borderRadius: '10px', width: 'fit-content', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
              מצב רגיל
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              מצב כהה
            </label>
          </div>
        )}

        {activeSection === 'system' && (
          <div style={{ marginTop: '15px', backgroundColor: '#fdf0f0', padding: '14px', borderRadius: '10px', textAlign: 'center', maxWidth: '80%', marginInline: 'auto' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', color: '#4b0000' }}>
              המערכת הוקמה ע"י אלרם חבני – סטודנט בקריה האקדמית אונו, כפרויקט גמר בקורס פיתוח Front End.
            </p>
          </div>
        )}

        {activeSection === 'login' && (
          <div style={{ marginTop: '15px', backgroundColor: '#f4f4f4', padding: '12px', borderRadius: '10px', maxWidth: '300px', marginInline: 'auto' }}>
            <p style={{ margin: 0, color: '#555', textAlign: 'center' }}>
              <strong>כניסה אחרונה:</strong> {lastLogin}
            </p>
          </div>
        )}
      </section>

      <div className="bottom-nav">
        <Link to="/home">
          <button className="backButton">חזרה לעמוד הבית</button>
        </Link>
      </div>
    </div>
  );
}
