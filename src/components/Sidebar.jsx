import React from 'react';
import './Sidebar.css';

function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }) {
  // 테마에 맞는 로고 파일 선택
  const logoSrc = theme === 'dark' ? '/assets/Logo Type_한글_White.png' : '/assets/Logo Type_한글.png';
  const emblemSrc = theme === 'dark' ? '/assets/Emblem_White.png' : '/assets/Emblem.png';

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'competition', label: '경쟁률 비교 관리', icon: '⚖️' },
    { id: 'survey', label: '설문조사 관리', icon: '📝' }
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <img src={emblemSrc} className="brand-emblem" alt="Emblem" />
        <img src={logoSrc} className="brand-logo" alt="Logo" />
      </div>
      
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="theme-toggle-container">
          <span className="theme-label">{theme === 'dark' ? '다크 모드' : '라이트 모드'}</span>
          <div className="theme-switch" onClick={toggleTheme} title="테마 변경"></div>
        </div>
        <div className="user-profile">
          <div className="avatar">仁</div>
          <div className="user-info">
            <span className="user-name">관리자</span>
            <span className="user-role">입학팀</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
