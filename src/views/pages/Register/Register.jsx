import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('נא למלא את כל השדות');
    } else if (!isValidEmail(email)) {
      setError('כתובת אימייל לא תקינה');
    } else if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
    } else if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });

        setError('');
        navigate('/home');
      } catch (error) {
        setError('😥 ההרשמה נכשלה: ' + error.message);
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="welcome">ברוכים הבאים למערכת ניהול למידה 📚</h1>
        <h2 className="register-heading">הרשמה</h2>

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="אימות סיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">הרשמה 📝</button>
        </form>

        <p className="register-link">
          כבר רשום? <Link to="/">להתחברות</Link>
        </p>
      </div>
    </div>
  );
}
