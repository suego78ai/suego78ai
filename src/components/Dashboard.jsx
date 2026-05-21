import React, { useState, useEffect } from 'react';
import { getCompetitionData, getSurveys, getActivityLogs } from '../data/mockData';
import './Dashboard.css';

function Dashboard({ setActiveTab }) {
  const [compData, setCompData] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setCompData(getCompetitionData());
    setSurveys(getSurveys());
    setLogs(getActivityLogs());
  }, []);

  // 통계 계산
  const totalEntries = compData.length;
  
  const averageRate = totalEntries > 0 
    ? (compData.reduce((acc, curr) => acc + curr.rate, 0) / totalEntries).toFixed(1)
    : 0;

  const highestEntry = totalEntries > 0
    ? [...compData].sort((a, b) => b.rate - a.rate)[0]
    : null;

  const totalSurveyResponses = surveys.reduce((acc, curr) => acc + (curr.responses ? curr.responses.length : 0), 0);

  // 최고 경쟁률 TOP 5 학과 선별
  const topFive = [...compData]
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const maxRateForChart = topFive.length > 0 ? topFive[0].rate : 100;

  return (
    <div className="dashboard-view animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>대시보드</h1>
          <p>전문대학 입학전형 경쟁률 비교와 설문조사 현황의 실시간 요약 통계입니다.</p>
        </div>
      </div>

      {/* 요약 통계 카드 그리드 */}
      <div className="stats-grid">
        <div className="card card-accent stat-card">
          <div className="stat-info">
            <span className="stat-label">최고 경쟁률 학과</span>
            <span className="stat-value">{highestEntry ? `${highestEntry.rate}:1` : 'N/A'}</span>
            <span className="stat-desc">{highestEntry ? `${highestEntry.college} ${highestEntry.department}` : ''}</span>
          </div>
          <div className="stat-icon">👑</div>
        </div>

        <div className="card card-accent stat-card">
          <div className="stat-info">
            <span className="stat-label">평균 경쟁률</span>
            <span className="stat-value">{averageRate}:1</span>
            <span className="stat-desc">전체 {totalEntries}개 전형 평균</span>
          </div>
          <div className="stat-icon">📈</div>
        </div>

        <div className="card card-accent stat-card">
          <div className="stat-info">
            <span className="stat-label">총 설문 응답 수</span>
            <span className="stat-value">{totalSurveyResponses}건</span>
            <span className="stat-desc">진행 중인 설문 참여수 합계</span>
          </div>
          <div className="stat-icon">📝</div>
        </div>

        <div className="card card-accent stat-card">
          <div className="stat-info">
            <span className="stat-label">등록된 대학 전형 수</span>
            <span className="stat-value">{totalEntries}개</span>
            <span className="stat-desc">비교/관리 대상 정보 총량</span>
          </div>
          <div className="stat-icon">🏫</div>
        </div>
      </div>

      <div className="grid-2">
        {/* 차트 영역 */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3>최고 경쟁률 TOP 5 모집 단위</h3>
            <span className="chart-subtitle">현재 기준 가장 인기가 높은 전문대학 학과입니다.</span>
          </div>
          <div className="chart-body">
            {topFive.length > 0 ? (
              <div className="custom-svg-chart">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="120" y1="20" x2="450" y2="20" stroke="var(--border-color)" strokeDasharray="4 4" />
                  <line x1="120" y1="80" x2="450" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
                  <line x1="120" y1="140" x2="450" y2="140" stroke="var(--border-color)" strokeDasharray="4 4" />
                  <line x1="120" y1="200" x2="450" y2="200" stroke="var(--border-color)" strokeDasharray="4 4" />
                  <line x1="120" y1="260" x2="450" y2="260" stroke="var(--border-color)" strokeDasharray="4 4" />

                  {topFive.map((item, idx) => {
                    const y = 35 + idx * 52;
                    const barWidth = ((item.rate / maxRateForChart) * 280); // max bar width 280px
                    return (
                      <g key={item.id} className="chart-bar-group">
                        {/* 대학/학과 라벨 */}
                        <text x="10" y={y + 12} className="chart-text label" fill="var(--text-primary)">
                          {item.college.slice(0, 6)}
                        </text>
                        <text x="10" y={y + 26} className="chart-text sub-label" fill="var(--text-secondary)">
                          {item.department.slice(0, 10)}
                        </text>

                        {/* 막대 배경 */}
                        <rect x="120" y={y + 2} width="300" height="20" rx="4" fill="var(--bg-primary)" opacity="0.5" />
                        
                        {/* 막대 그래프 */}
                        <rect 
                          x="120" 
                          y={y + 2} 
                          width={barWidth} 
                          height="20" 
                          rx="4" 
                          fill="url(#barGradient)" 
                          className="animate-bar"
                        />

                        {/* 경쟁률 수치 라벨 */}
                        <text x={120 + barWidth + 8} y={y + 16} className="chart-text value" fill="var(--accent)" fontWeight="700">
                          {item.rate.toFixed(1)}:1
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="no-data">등록된 경쟁률 데이터가 없습니다.</div>
            )}
          </div>
          <div className="chart-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('competition')}>
              경쟁률 상세 비교하러 가기 &rarr;
            </button>
          </div>
        </div>

        {/* 활동 타임라인 및 설문 참여 */}
        <div className="card logs-card">
          <div className="card-header">
            <h3>최근 활동 타임라인</h3>
            <span className="card-subtitle">시스템 내 데이터 추가, 설문 등록 등의 활동 이력입니다.</span>
          </div>
          <div className="timeline">
            {logs.slice(0, 6).map((log, index) => (
              <div key={index} className="timeline-item">
                <div className={`timeline-badge ${log.type}`}>
                  {log.type === 'data' ? '📊' : log.type === 'survey' ? '📝' : '⚙️'}
                </div>
                <div className="timeline-content">
                  <p className="timeline-message">{log.message}</p>
                  <span className="timeline-time">
                    {new Date(log.time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {new Date(log.time).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="no-data">최근 시스템 활동이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
