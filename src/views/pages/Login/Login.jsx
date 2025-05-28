import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

import { auth } from "../../../firebase";

import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('נא למלא את כל השדות');
    } else if (!isValidEmail(email)) {
      setError('כתובת אימייל לא תקינה');
    } else if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setError('');
        navigate('/home');
      } catch (error) {
        setError('😥 התחברות נכשלה: ' + error.message);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="welcome">ברוכים הבאים למערכת ניהול למידה 📚</h1>
        <h2 className="login-heading">התחברות</h2>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">התחבר 🔓</button>
        </form>

        <p className="register-link">
          משתמש חדש? <Link to="/register">להרשמה</Link>
        </p>
      </div>
    </div>
  );
}
