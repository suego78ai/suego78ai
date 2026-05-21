import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CompetitionManager from './components/CompetitionManager';
import SurveyManager from './components/SurveyManager';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 테마 상태 관리 (로컬스토리지에 저장하여 유지)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('suego78ai_theme') || 'dark';
  });

  // 알림 토스트 상태 관리
  const [notifications, setNotifications] = useState([]);

  // 테마가 변경될 때마다 HTML root 속성 반영
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('suego78ai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 알림 추가 함수
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotif = { id, message, type };
    setNotifications(prev => [...prev, newNotif]);
    
    // 4초 후 자동 제거
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 4000);
  };

  // 탭 변경 시 화면 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'competition':
        return <CompetitionManager addNotification={addNotification} />;
      case 'survey':
        return <SurveyManager addNotification={addNotification} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* 사이드바 네비게이션 */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* 알림 토스트 영역 */}
      <div className="toast-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`toast toast-${notif.type}`}>
            <span>
              {notif.type === 'success' ? '✅ ' : notif.type === 'warning' ? '⚠️ ' : notif.type === 'danger' ? '🚨 ' : 'ℹ️ '}
              {notif.message}
            </span>
            <button 
              className="toast-close-btn"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
