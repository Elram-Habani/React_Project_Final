import './Statistics.css';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement);

export default function Statistics({ tasks }) {
  const progressBySubject = {};
  const methodCounts = {};

  tasks.forEach((task) => {
    if (!progressBySubject[task.subject]) {
      progressBySubject[task.subject] = [];
    }
    progressBySubject[task.subject].push(task.status);

    if (!methodCounts[task.method]) {
      methodCounts[task.method] = 0;
    }
    methodCounts[task.method]++;
  });

  const barData = {
    labels: Object.keys(progressBySubject),
    datasets: [
      {
        label: 'התקדמות',
        data: Object.values(progressBySubject).map(
          (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
        ),
        backgroundColor: '#4b0000',
      },
    ],
  };

  const methodLabels = Object.keys(methodCounts);
  const methodValues = Object.values(methodCounts);
  const methodTotal = methodValues.reduce((a, b) => a + b, 0);
  const methodPercentages = methodValues.map((val) =>
    Math.round((val / methodTotal) * 100)
  );

  const pieData = {
    labels: methodLabels,
    datasets: [
      {
        data: methodValues,
        backgroundColor: ['#1a8f3a', '#139fc9', '#ffcc00', '#f99cab'],
      },
    ],
  };

  const totalProgress = tasks.length
    ? Math.round(tasks.reduce((sum, t) => sum + t.status, 0) / tasks.length)
    : 0;

  const weakestSubject = Object.entries(progressBySubject).reduce(
    (min, [subject, statuses]) => {
      const avg = statuses.reduce((a, b) => a + b, 0) / statuses.length;
      return avg < min.avg ? { subject, avg } : min;
    },
    { subject: '', avg: Infinity }
  );

  const mostUsedMethod = Object.entries(methodCounts).reduce(
    (max, [method, count]) => (count > max.count ? { method, count } : max),
    { method: '', count: 0 }
  );

  return (
    <div className="page">
      <h1 className="title">סטטיסטיקות ומעקב התקדמות</h1>

      <div className="charts-container">
        <div className="chart">
          <h3>גרף התקדמות כללי</h3>
          <Bar data={barData} />
        </div>

        <div className="chart">
          <h3>העדפת שימוש</h3>
          <Pie data={pieData} />
          <ul style={{ textAlign: 'right', marginTop: '15px' }}>
            {methodLabels.map((label, idx) => (
              <li key={idx}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    backgroundColor: pieData.datasets[0].backgroundColor[idx],
                    marginLeft: 8,
                  }}
                ></span>
                {label} – {methodPercentages[idx]}%
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="recommendations">
        <h3 className="green">המלצות לשיפור:</h3>
        <ul className="recommend-list">
          {weakestSubject.subject && (
            <li>
              לתת דגש יותר ב־<strong>{weakestSubject.subject}</strong>
            </li>
          )}
          {mostUsedMethod.method && (
            <li>
              שיטת הלימוד הנכונה עבורך: <strong>{mostUsedMethod.method}</strong>
            </li>
          )}
        </ul>
        <p className="success-rate">
          מדד הצלחה: <span className="green">{totalProgress}%</span>
        </p>

        <div className="bottom-nav">
          <Link to="/home">
            <button className="backButton">חזרה לעמוד הבית</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
