import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TaskManagement.css';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { auth } from '../../../firebase';

export default function TaskManagement({ tasks, setTasks }) {
  const [subject, setSubject] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [activePanel, setActivePanel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
      } catch (err) {
        setError('שגיאה בטעינת משימות: ' + err.message);
      }
    };

    fetchTasks();
  }, [setTasks]);

  const isFinalHebrewLetter = (char) => {
    const finals = ['ן', 'ם', 'ץ', 'ף', 'ך'];
    return finals.includes(char);
  };

  const addTask = async () => {
    if (!subject || !method || !date || status === '') {
      setError('נא למלא את כל השדות');
      return;
    }

    if (subject.length < 2) {
      setError('נושא הלמידה חייב להכיל לפחות שתי אותיות');
      return;
    }

    if (isFinalHebrewLetter(subject[0])) {
      setError('נושא הלמידה לא יכול להתחיל באות סופית');
      return;
    }

    const numericStatus = Number(status);
    if (isNaN(numericStatus) || numericStatus < 0 || numericStatus > 100) {
      setError('אנא הזן אחוז התקדמות חוקי בין 0 ל־100');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('משתמש אינו מחובר');
      return;
    }

    const newTask = {
      subject,
      method,
      status: numericStatus,
      date,
      userId: user.uid
    };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
      setSubject('');
      setMethod('');
      setStatus('');
      setDate('');
      setError('');
      setShowAddForm(false);
    } catch (err) {
      setError('שגיאה בשמירת המשימה: ' + err.message);
    }
  };

  const deleteTask = async (idToDelete) => {
    try {
      await deleteDoc(doc(db, 'tasks', idToDelete));
      const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
      setTasks(updatedTasks);
    } catch (err) {
      setError('שגיאה במחיקת המשימה: ' + err.message);
    }
  };

  const handleSearch = () => {
    const filtered = tasks.filter((task) => {
      const subjectMatch = searchSubject ? task.subject.includes(searchSubject) : true;
      const dateMatch = searchDate ? task.date === searchDate : true;
      return subjectMatch && dateMatch;
    });
    setSearchResults(filtered);
  };

  return (
    <div className="page">
      <h1 className="title">ניהול משימות</h1>

      <button onClick={() => setShowAddForm(!showAddForm)} className="addButton">
        {showAddForm ? 'ביטול הוספה' : 'הוסף משימה+'}
      </button>

      {showAddForm && (
        <div className="form task-form">
          <input type="text" placeholder="נושא הלמידה" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">בחר שיטת למידה</option>
            <option value="מצגות">מצגות</option>
            <option value="סיכומים">סיכומים</option>
            <option value="וידאו">וידאו</option>
            <option value="תרגולים ממבחנים">תרגולים ממבחנים</option>
          </select>
          <input type="number" placeholder="אחוז התקדמות משוער (0-100)" value={status} min={0} max={100} onChange={(e) => setStatus(e.target.value)} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="green" onClick={addTask}>שמור משימה</button>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div className="table">
        {tasks.length > 0 && (
          <div className="rowHeader">
            <div>רשימת משימות</div>
            <div>סטטוס</div>
            <div>יעד סיום</div>
            <div>שיטת למידה</div>
          </div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="row">
            <div>{task.subject}</div>
            <div>
              <progress value={task.status} max="100" />
              <span> {task.status}%</span>
            </div>
            <div>{task.date}</div>
            <div>{task.method}</div>
          </div>
        ))}
      </div>

      <div className="buttonRow">
        <button className="grayBtn" onClick={() => setActivePanel('search')}>🔍 חיפוש משימה</button>
        <button className="grayBtn" onClick={() => setActivePanel('edit')}>✏️ עריכת המשימות</button>
        <button className="grayBtn" onClick={() => setActivePanel('inProgress')}>📋 משימות בתהליך</button>
      </div>

      {activePanel === 'search' && (
        <div style={{ marginTop: '20px' }}>
          <h3>חיפוש לפי נושא לימוד / תאריך</h3>
          <input type="text" placeholder="הכנס נושא לימוד" value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)} style={{ marginBottom: '10px', width: '200px' }} />
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={{ marginBottom: '10px', width: '200px' }} />
          <button onClick={handleSearch} className="green">בצע חיפוש</button>

          {searchResults !== null && (
            <>
              {searchResults.length > 0 ? (
                <div style={{ marginTop: '15px' }}>
                  <h4>תוצאות:</h4>
                  {searchResults.map((task) => (
                    <div key={task.id} className="task-preview">
                      {task.subject} - {task.date}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginTop: '10px' }}>לא נמצאו תוצאות</p>
              )}
            </>
          )}
        </div>
      )}

      {activePanel === 'edit' && (
        <div style={{ marginTop: '30px' }}>
          <h3>מחיקת משימות</h3>
          {tasks.map((task) => (
            <div key={task.id} className="task-preview">
              <div>{task.subject} - {task.date}</div>
              <button className="deleteBtn" onClick={() => deleteTask(task.id)}>מחק</button>
            </div>
          ))}
        </div>
      )}

      {activePanel === 'inProgress' && tasks.some((task) => task.status < 100) && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#4b0000' }}>משימות שלא הושלמו</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks
              .filter((task) => task.status < 100)
              .map((task) => (
                <li key={task.id} className="task-preview">
                  ❗ {task.subject} – {task.status}%
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="bottom-nav">
        <Link to="/home">
          <button className="backButton">חזרה לעמוד הבית</button>
        </Link>
      </div>
    </div>
  );
}
