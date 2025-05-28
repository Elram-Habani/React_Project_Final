import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <Link to="/help">הגדרות ועזרה⚙️</Link>
          </li>
          <li>
            <Link to="/users">ניהול משתמשים👥</Link>
          </li>
        </ul>
      </aside>

      <main className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.bold}>מערכת לניהול למידה</span>
          <span role="img" aria-label="books">📚</span>{' '}
        </h1>

        <p className={styles.subtitle}>“ארגון הלמידה שלך בצורה ממוקדת”</p>

        <p className={styles.desc}>מערכת לניהול זמן ומשימות לימוד המותאמת לכל סטודנט</p>

        <ul className={styles.features}>
          <li>– ניהול משימות</li>
          <li>– תכנון זמן כראוי</li>
          <li>– סטטיסטיקות והתקדמות</li>
        </ul>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Link to="/tasks">
            <button className={styles.greenBtn}>מעבר לניהול משימות</button>
          </Link>
          <Link to="/statistics">
            <button className={styles.greenBtn}>למעקב התקדמות</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
