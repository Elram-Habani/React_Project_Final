import './HelpAndSettings.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HelpAndSettings() {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibility, setVisibility] = useState('private');
  const [alerts, setAlerts] = useState({
    reminders: false,
    updates: false,
  });

  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const faqs = [
    {
      question: 'איך להוסיף משימה?',
      answer: 'הזן נושא לימוד, אחוז התקדמות ותאריך – ולחץ על "הוסף משימה+".',
    },
    {
      question: 'איך אפשר לערוך או למחוק משימה קיימת?',
      answer: 'בעמוד ניהול המשימות, לצד כל משימה תופיע אפשרות "ערוך" או "מחק". לחיצה תאפשר לשנות או להסיר את המשימה מהרשימה.',
    },
    {
      question: 'איך ניתן לעקוב אחרי ההתקדמות שלי?',
      answer: 'ניתן לצפות בלשונית "סטטיסטיקות ומעקב", שם מוצגים גרפים של ההתקדמות הכוללת, סוגי הלמידה המועדפים והמלצות לשיפור.',
    },
    {
      question: 'האם אפשר לשמור את ההעדפות שלי והפרטים האישיים?',
      answer: 'כן. בעמוד "עזרה והגדרות" אפשר לעדכן את השם, המייל והסיסמה ולבחור האם לוח הזמנים שלך יהיה ציבורי או פרטי. אל תשכח ללחוץ על "שמור שינויים".',
    },
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const toggleAlert = (key) => {
    setAlerts({ ...alerts, [key]: !alerts[key] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (userDetails.fullName && userDetails.fullName.trim().length < 2) {
      newErrors.fullName = 'יש להזין שם מלא עם לפחות 2 תווים';
    }

    if (userDetails.email && (!userDetails.email.includes('@') || !userDetails.email.includes('.'))) {
      newErrors.email = 'יש להזין כתובת אימייל תקינה';
    }

    if (userDetails.password && userDetails.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = () => {
    if (validateForm()) {
      alert('ההגדרות נשמרו בהצלחה!');
    }
  };

  return (
    <div className="page">
      <h1 className="title">עזרה והגדרות</h1>

      <section className="section">
        <h2 className="green">שאלות נפוצות</h2>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} onClick={() => toggleAnswer(index)} className="faq-item">
              <strong>{faq.question}</strong>
              {openIndex === index && <p className="answer">{faq.answer}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="blue">הגדרות משתמש</h2>
        <p>שדות לעדכון פרטים:</p>
        <ul className="settings-list">
          <li>
            שם מלא
            <input
              type="text"
              name="fullName"
              value={userDetails.fullName}
              onChange={handleInputChange}
              className="inputBox"
              placeholder="הקלד שם מלא"
            />
            {errors.fullName && <div className="errorMsg">{errors.fullName}</div>}
          </li>
          <li>
            Email תקני
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="inputBox"
              placeholder="הקלד כתובת מייל"
            />
            {errors.email && <div className="errorMsg">{errors.email}</div>}
          </li>
          <li>
            סיסמה + אימות
            <input
              type="password"
              name="password"
              value={userDetails.password}
              onChange={handleInputChange}
              className="inputBox"
              placeholder="הקלד סיסמה"
            />
            {errors.password && <div className="errorMsg">{errors.password}</div>}
          </li>
        </ul>
      </section>

      <section className="section">
        <h2 className="gray">פרטים</h2>
        <div className="visibility-options">
          <span className="dot red" />
          הצגת לוח זמנים שלי:
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={() => setVisibility('private')}
            />
            פרטי
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
            />
            ציבורי
          </label>
        </div>
      </section>

      <section className="section">
        <h2 className="gray">התראות</h2>
        <div className="alerts-list">
          <label>
            <input
              type="checkbox"
              checked={alerts.reminders}
              onChange={() => toggleAlert('reminders')}
            />
            🔔 תזכורות למשימות
          </label>
          <label>
            <input
              type="checkbox"
              checked={alerts.updates}
              onChange={() => toggleAlert('updates')}
            />
            🔔 עדכונים מקבוצות הלימוד
          </label>
        </div>
      </section>

      <div className="bottom-nav">
        <button className="saveButton" onClick={saveSettings}>💾 שמור שינויים</button>
        <Link to="/home">
          <button className="backButton">חזרה לעמוד הבית</button>
        </Link>
      </div>
    </div>
  );
}
