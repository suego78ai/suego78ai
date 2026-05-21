import React, { useState, useEffect } from 'react';
import { getSurveys, submitSurveyResponse, createSurvey } from '../data/mockData';
import './SurveyManager.css';

function SurveyManager({ addNotification }) {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null); // 설문 참여용 대상
  const [activeAnalysis, setActiveAnalysis] = useState(null); // 결과 분석용 대상
  
  // 설문 참여 상태
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // 설문 생성기 상태
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newQuestions, setNewQuestions] = useState([
    { questionText: '', options: ['', ''] }
  ]);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    setSurveys(getSurveys());
  };

  // 설문 참여 시작
  const startSurvey = (survey) => {
    setActiveSurvey(survey);
    setActiveAnalysis(null);
    setCurrentStep(0);
    setAnswers({});
  };

  // 객관식 선택 시
  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // 설문 단계 네비게이션
  const nextStep = () => {
    const currentQuestion = activeSurvey.questions[currentStep];
    if (!answers[currentQuestion.id]) {
      addNotification('질문에 답변해 주시기 바랍니다.', 'warning');
      return;
    }
    if (currentStep < activeSurvey.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 설문 응답 최종 제출
  const handleSubmitSurvey = () => {
    const currentQuestion = activeSurvey.questions[currentStep];
    if (!answers[currentQuestion.id]) {
      addNotification('질문에 답변해 주시기 바랍니다.', 'warning');
      return;
    }

    const updated = submitSurveyResponse(activeSurvey.id, answers);
    setSurveys(updated);
    addNotification('설문 조사에 참여해 주셔서 감사합니다!', 'success');
    setActiveSurvey(null);
  };

  // 분석 화면 열기
  const showAnalysis = (survey) => {
    setActiveAnalysis(survey);
    setActiveSurvey(null);
  };

  // 설문 생성 관련 함수
  const handleAddQuestion = () => {
    setNewQuestions([...newQuestions, { questionText: '', options: ['', ''] }]);
  };

  const handleRemoveQuestion = (idx) => {
    if (newQuestions.length === 1) return;
    setNewQuestions(newQuestions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx, val) => {
    const updated = [...newQuestions];
    updated[idx].questionText = val;
    setNewQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    const updated = [...newQuestions];
    updated[qIdx].options[optIdx] = val;
    setNewQuestions(updated);
  };

  const handleAddOption = (qIdx) => {
    const updated = [...newQuestions];
    updated[qIdx].options.push('');
    setNewQuestions(updated);
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    const updated = [...newQuestions];
    if (updated[qIdx].options.length <= 2) return;
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
    setNewQuestions(updated);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      addNotification('설문 제목과 설명을 작성해 주세요.', 'warning');
      return;
    }

    // 검증
    for (let q of newQuestions) {
      if (!q.questionText.trim()) {
        addNotification('질문 내용을 입력해 주세요.', 'warning');
        return;
      }
      const validOptions = q.options.filter(o => o.trim() !== '');
      if (validOptions.length < 2) {
        addNotification('각 질문은 최소 2개 이상의 선택지를 가져야 합니다.', 'warning');
        return;
      }
    }

    // 전송 데이터 가공
    const formattedQuestions = newQuestions.map((q, idx) => ({
      id: `q${idx + 1}`,
      type: 'choice',
      questionText: q.questionText,
      options: q.options.filter(o => o.trim() !== '')
    }));

    const updated = createSurvey(newTitle, newDesc, formattedQuestions);
    setSurveys(updated);
    addNotification(`새 설문조사 "${newTitle}"가 생성되었습니다.`, 'success');
    
    // 상태 초기화
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setNewQuestions([{ questionText: '', options: ['', ''] }]);
  };

  // 응답 비율 분석 계산 헬퍼
  const getQuestionAnalysis = (survey, question) => {
    const total = survey.responses ? survey.responses.length : 0;
    const counts = {};
    
    // 초기화
    question.options.forEach(opt => { counts[opt] = 0; });
    
    // 카운트
    if (survey.responses) {
      survey.responses.forEach(resp => {
        const val = resp[question.id];
        if (val && counts[val] !== undefined) {
          counts[val]++;
        }
      });
    }

    // 비율 변환
    return question.options.map((opt, idx) => {
      const count = counts[opt] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return { option: opt, count, percentage, colorIdx: idx };
    });
  };

  return (
    <div className="survey-manager animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>설문조사 관리 및 분석</h1>
          <p>전문대학 입학 제도 개선 및 선호도 평가를 위한 설문을 개설하고 결과를 모니터링합니다.</p>
        </div>
        <div className="header-actions">
          {!isCreating && !activeSurvey && !activeAnalysis && (
            <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
              ➕ 새 설문조사 생성
            </button>
          )}
          {(isCreating || activeSurvey || activeAnalysis) && (
            <button className="btn btn-secondary" onClick={() => {
              setIsCreating(false);
              setActiveSurvey(null);
              setActiveAnalysis(null);
            }}>
              &larr; 목록으로 돌아가기
            </button>
          )}
        </div>
      </div>

      {/* 1. 설문 리스트 뷰 */}
      {!isCreating && !activeSurvey && !activeAnalysis && (
        <div className="survey-list-grid">
          {surveys.map(survey => {
            const count = survey.responses ? survey.responses.length : 0;
            return (
              <div key={survey.id} className="card survey-card card-accent">
                <div className="survey-card-header">
                  <h3>{survey.title}</h3>
                  <span className="badge badge-success">참여 수: {count}건</span>
                </div>
                <p className="survey-card-desc">{survey.description}</p>
                <div className="survey-card-stats">
                  <span>질문 문항: {survey.questions.length}개</span>
                </div>
                <div className="survey-card-actions">
                  <button className="btn btn-primary" onClick={() => startSurvey(survey)}>
                    🖋️ 설문 참여
                  </button>
                  <button className="btn btn-secondary" onClick={() => showAnalysis(survey)}>
                    📊 결과 분석
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. 설문 응답 클라이언트 */}
      {activeSurvey && (
        <div className="card survey-client-card animate-fade-in">
          <div className="survey-client-header">
            <h2>{activeSurvey.title}</h2>
            <div className="survey-progress-bar-container">
              <div 
                className="survey-progress-bar"
                style={{ width: `${((currentStep + 1) / activeSurvey.questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="survey-step-indicator">
              문항 {currentStep + 1} / {activeSurvey.questions.length}
            </div>
          </div>

          <div className="survey-client-body">
            <h3 className="survey-question-text">
              Q{currentStep + 1}. {activeSurvey.questions[currentStep].questionText}
            </h3>
            <div className="survey-options-list">
              {activeSurvey.questions[currentStep].options.map((option, idx) => {
                const qId = activeSurvey.questions[currentStep].id;
                const isSelected = answers[qId] === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`survey-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(qId, option)}
                  >
                    <span className="option-number">{idx + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="survey-client-footer">
            <button
              className="btn btn-secondary"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              이전 단계
            </button>
            {currentStep < activeSurvey.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={nextStep}>
                다음 단계
              </button>
            ) : (
              <button className="btn btn-primary btn-submit" onClick={handleSubmitSurvey}>
                설문 완료 및 제출
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. 설문 결과 분석 대시보드 */}
      {activeAnalysis && (
        <div className="survey-analysis animate-fade-in">
          <div className="card analysis-summary-card">
            <h2>{activeAnalysis.title} - 설문 분석 결과</h2>
            <div className="total-responses-badge">
              총 참여 인원: <strong>{activeAnalysis.responses ? activeAnalysis.responses.length : 0}</strong>명
            </div>
          </div>

          <div className="analysis-questions-list">
            {activeAnalysis.questions.map((q, idx) => {
              const stats = getQuestionAnalysis(activeAnalysis, q);
              const colorPalette = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
              
              return (
                <div key={q.id} className="card question-analysis-card">
                  <h4>Q{idx + 1}. {q.questionText}</h4>
                  <div className="analysis-chart-layout">
                    {/* 데이터 바 분석 */}
                    <div className="bars-analysis-list">
                      {stats.map((stat, sIdx) => (
                        <div key={sIdx} className="analysis-bar-row">
                          <div className="analysis-bar-info">
                            <span className="option-label">{stat.option}</span>
                            <span className="option-value">
                              {stat.count}명 ({stat.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="analysis-bar-container">
                            <div
                              className="analysis-bar-fill"
                              style={{
                                width: `${stat.percentage}%`,
                                backgroundColor: colorPalette[sIdx % colorPalette.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SVG 간이 원형 차트 */}
                    <div className="donut-chart-container">
                      <svg viewBox="0 0 160 160" width="100%" height="100%">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border-color)" strokeWidth="16" />
                        {(() => {
                          let cumulativePercent = 0;
                          return stats.map((stat, sIdx) => {
                            if (stat.percentage === 0) return null;
                            const radius = 70;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDasharray = `${(stat.percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = `${- (cumulativePercent / 100) * circumference}`;
                            cumulativePercent += stat.percentage;
                            
                            return (
                              <circle
                                key={sIdx}
                                cx="80"
                                cy="80"
                                r={radius}
                                fill="none"
                                stroke={colorPalette[sIdx % colorPalette.length]}
                                strokeWidth="16"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 80 80)"
                              />
                            );
                          });
                        })()}
                        {/* 도넛 중앙 텍스트 */}
                        <circle cx="80" cy="80" r="50" fill="var(--bg-secondary)" />
                        <text x="80" y="78" textAnchor="middle" dominantBaseline="middle" className="chart-center-text-title" fill="var(--text-secondary)">
                          총 참여자
                        </text>
                        <text x="80" y="98" textAnchor="middle" dominantBaseline="middle" className="chart-center-text-value" fill="var(--text-primary)" fontWeight="700">
                          {activeAnalysis.responses ? activeAnalysis.responses.length : 0}명
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 새 설문조사 생성 양식 */}
      {isCreating && (
        <div className="card survey-create-card animate-fade-in">
          <h2>새 설문지 만들기</h2>
          <span className="subtitle">학생 및 학부모를 대상으로 조사할 새로운 설문을 개설합니다.</span>
          
          <form onSubmit={handleCreateSubmit} className="survey-create-form">
            <div className="form-group">
              <label className="form-label">설문 조사 제목 *</label>
              <input
                type="text"
                className="form-control"
                placeholder="예: 2026학년도 대학 선호도 심층 설문"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">설문 요약 및 안내 설명 *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="설문의 목적과 대상자에 대한 상세 설명을 작성해 주세요."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </div>

            <div className="creator-questions-section">
              <h3>설문 문항 구성 ({newQuestions.length}개)</h3>
              
              {newQuestions.map((q, qIdx) => (
                <div key={qIdx} className="creator-question-box">
                  <div className="q-box-header">
                    <h4>문항 {qIdx + 1}</h4>
                    {newQuestions.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm btn-delete"
                        onClick={() => handleRemoveQuestion(qIdx)}
                      >
                        문항 제거
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">질문 텍스트 *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="예: 우리 대학 진학을 결정할 때 가장 큰 요인은 무엇인가요?"
                      value={q.questionText}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      required
                    />
                  </div>

                  <div className="creator-options-container">
                    <label className="form-label">답변 선택지 목록 (객관식) *</label>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="option-input-row">
                        <span className="opt-number-bullet">{optIdx + 1}</span>
                        <input
                          type="text"
                          className="form-control option-control"
                          placeholder={`선택지 ${optIdx + 1} 입력`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          required
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm opt-delete-btn"
                            onClick={() => handleRemoveOption(qIdx, optIdx)}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm add-opt-btn"
                      onClick={() => handleAddOption(qIdx)}
                    >
                      ➕ 선택지 추가
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary add-q-btn"
                onClick={handleAddQuestion}
              >
                ➕ 새 문항 추가
              </button>
            </div>

            <div className="creator-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCreating(false)}
              >
                취소
              </button>
              <button type="submit" className="btn btn-primary">
                설문지 등록 및 발행
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SurveyManager;
