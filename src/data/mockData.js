// 초기 모의 입학 경쟁률 데이터
const initialCompetitionData = [
  { id: 1, college: '동양미래대학교', department: '컴퓨터정보공학과', year: 2025, type: '수시1차', recruits: 30, applicants: 345, rate: 11.5 },
  { id: 2, college: '동양미래대학교', department: '컴퓨터정보공학과', year: 2025, type: '정시', recruits: 10, applicants: 152, rate: 15.2 },
  { id: 3, college: '동양미래대학교', department: '시각디자인과', year: 2025, type: '수시1차', recruits: 20, applicants: 284, rate: 14.2 },
  { id: 4, college: '인하공업전문대학', department: '항공운항과', year: 2025, type: '수시1차', recruits: 40, applicants: 1420, rate: 35.5 },
  { id: 5, college: '인하공업전문대학', department: '항공운항과', year: 2025, type: '수시2차', recruits: 30, applicants: 960, rate: 32.0 },
  { id: 6, college: '인하공업전문대학', department: '기계공학과', year: 2025, type: '수시1차', recruits: 50, applicants: 485, rate: 9.7 },
  { id: 7, college: '한양여자대학교', department: '간호학과', year: 2025, type: '정시', recruits: 15, applicants: 312, rate: 20.8 },
  { id: 8, college: '한양여자대학교', department: '시각미디어디자인과', year: 2025, type: '수시1차', recruits: 25, applicants: 575, rate: 23.0 },
  { id: 9, college: '명지전문대학교', department: '실용음악과(보컬)', year: 2025, type: '정시', recruits: 5, applicants: 415, rate: 83.0 },
  { id: 10, college: '명지전문대학교', department: '소프트웨어콘텐츠과', year: 2025, type: '수시2차', recruits: 30, applicants: 390, rate: 13.0 },
  { id: 11, college: '서울여자간호대학교', department: '간호학과', year: 2025, type: '수시1차', recruits: 60, applicants: 1056, rate: 17.6 },
  { id: 12, college: '동서울대학교', department: '게임콘텐츠과', year: 2025, type: '수시2차', recruits: 25, applicants: 480, rate: 19.2 },
  { id: 13, college: '동서울대학교', department: '전기정보제어과', year: 2025, type: '수시1차', recruits: 40, applicants: 260, rate: 6.5 },
  { id: 14, college: '인하공업전문대학', department: '컴퓨터시스템과', year: 2024, type: '수시1차', recruits: 35, applicants: 420, rate: 12.0 },
  { id: 15, college: '한양여자대학교', department: '간호학과', year: 2024, type: '수시1차', recruits: 40, applicants: 720, rate: 18.0 }
];

// 초기 모의 설문조사 데이터
const initialSurveys = [
  {
    id: 'survey-1',
    title: '2025학년도 전문대학 입학전형 만족도 조사',
    description: '전문대학 입학전형의 투명성, 전형 방법의 단순성 및 안내 만족도 등을 평가하기 위한 설문조사입니다.',
    questions: [
      {
        id: 'q1',
        type: 'choice',
        questionText: '본인이 지원한 전문대학의 전형 안내(모집요강 등)가 이해하기 쉬웠습니까?',
        options: ['매우 쉬웠음', '쉬운 편임', '보통임', '어려운 편임', '매우 어려웠음']
      },
      {
        id: 'q2',
        type: 'choice',
        questionText: '전형 과정(서류 제출, 면접, 실기 등) 중 가장 개선이 필요한 부분은 무엇입니까?',
        options: ['서류 제출 간소화', '면접 일정 조율', '실기 평가 기준 공개', '비대면 전형 확대', '개선 불필요']
      },
      {
        id: 'q3',
        type: 'choice',
        questionText: '입학 안내 웹사이트 및 경쟁률 공개 시스템 정보의 만족도는 어떠합니까?',
        options: ['매우 만족', '대체로 만족', '보통', '대체로 불만족', '매우 불만족']
      }
    ],
    responses: [
      { q1: '매우 쉬웠음', q2: '서류 제출 간소화', q3: '매우 만족' },
      { q1: '쉬운 편임', q2: '면접 일정 조율', q3: '대체로 만족' },
      { q1: '쉬운 편임', q2: '서류 제출 간소화', q3: '대체로 만족' },
      { q1: '보통임', q2: '실기 평가 기준 공개', q3: '보통' },
      { q1: '매우 쉬웠음', q2: '개선 불필요', q3: '매우 만족' },
      { q1: '어려운 편임', q2: '서류 제출 간소화', q3: '대체로 만족' },
      { q1: '쉬운 편임', q2: '면접 일정 조율', q3: '보통' },
      { q1: '매우 쉬웠음', q2: '서류 제출 간소화', q3: '매우 만족' }
    ]
  },
  {
    id: 'survey-2',
    title: '고등학생 전문대학 선호 요인 조사',
    description: '전문대학 진학을 고려할 때 가장 중요하게 생각하는 선택 기준을 조사하는 설문입니다.',
    questions: [
      {
        id: 'q1',
        type: 'choice',
        questionText: '전문대학을 선택할 때 가장 최우선으로 고려하는 사항은 무엇입니까?',
        options: ['높은 취업률', '지리적 위치/교통', '등록금 및 장학금', '학과/전공의 특성화', '대학의 인지도']
      },
      {
        id: 'q2',
        type: 'choice',
        questionText: '희망하는 진로 분야(계열)는 무엇입니까?',
        options: ['공학계열(IT, 기계 등)', '보건의료계열(간호, 보건 등)', '예체능계열(디자인, 실용음악 등)', '인문사회/서비스계열', '자연과학계열']
      }
    ],
    responses: [
      { q1: '높은 취업률', q2: '공학계열(IT, 기계 등)' },
      { q1: '높은 취업률', q2: '보건의료계열(간호, 보건 등)' },
      { q1: '지리적 위치/교통', q2: '예체능계열(디자인, 실용음악 등)' },
      { q1: '학과/전공의 특성화', q2: '공학계열(IT, 기계 등)' },
      { q1: '등록금 및 장학금', q2: '보건의료계열(간호, 보건 등)' },
      { q1: '높은 취업률', q2: '인문사회/서비스계열' },
      { q1: '높은 취업률', q2: '공학계열(IT, 기계 등)' },
      { q1: '학과/전공의 특성화', q2: '예체능계열(디자인, 실용음악 등)' },
      { q1: '지리적 위치/교통', q2: '인문사회/서비스계열' },
      { q1: '높은 취업률', q2: '보건의료계열(간호, 보건 등)' }
    ]
  }
];

// LocalStorage 키 정의
const COMP_STORAGE_KEY = 'suego78ai_competition_data';
const SURVEY_STORAGE_KEY = 'suego78ai_survey_data';
const ACTIVITY_STORAGE_KEY = 'suego78ai_activity_log';

// 초기화 함수
export const initializeStorage = () => {
  if (!localStorage.getItem(COMP_STORAGE_KEY)) {
    localStorage.setItem(COMP_STORAGE_KEY, JSON.stringify(initialCompetitionData));
  }
  if (!localStorage.getItem(SURVEY_STORAGE_KEY)) {
    localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(initialSurveys));
  }
  if (!localStorage.getItem(ACTIVITY_STORAGE_KEY)) {
    const initialLogs = [
      { time: new Date(Date.now() - 3600000 * 24).toISOString(), message: '시스템이 초기화되었습니다.', type: 'system' },
      { time: new Date(Date.now() - 3600000 * 5).toISOString(), message: '명지전문대학교 실용음악과 경쟁률 데이터가 등록되었습니다.', type: 'data' },
      { time: new Date(Date.now() - 3600000 * 2).toISOString(), message: '설문조사 "2025학년도 전문대학 입학전형 만족도 조사"에 새로운 응답이 등록되었습니다.', type: 'survey' }
    ];
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(initialLogs));
  }
};

// 경쟁률 데이터 가져오기
export const getCompetitionData = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(COMP_STORAGE_KEY));
};

// 경쟁률 데이터 저장
export const saveCompetitionData = (data) => {
  localStorage.setItem(COMP_STORAGE_KEY, JSON.stringify(data));
};

// 경쟁률 데이터 개별 등록
export const addCompetitionEntry = (entry) => {
  const data = getCompetitionData();
  const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
  const newEntry = { ...entry, id: newId, rate: parseFloat((entry.applicants / entry.recruits).toFixed(2)) };
  const updated = [newEntry, ...data];
  saveCompetitionData(updated);
  addActivityLog(`${entry.college} ${entry.department} (${entry.type}) 경쟁률 데이터가 신규 등록되었습니다.`, 'data');
  return updated;
};

// 경쟁률 데이터 수정
export const updateCompetitionEntry = (id, updatedEntry) => {
  const data = getCompetitionData();
  const updated = data.map(item => {
    if (item.id === id) {
      const merged = { ...item, ...updatedEntry };
      merged.rate = parseFloat((merged.applicants / merged.recruits).toFixed(2));
      addActivityLog(`${merged.college} ${merged.department} (${merged.type}) 경쟁률 데이터가 수정되었습니다.`, 'data');
      return merged;
    }
    return item;
  });
  saveCompetitionData(updated);
  return updated;
};

// 경쟁률 데이터 삭제
export const deleteCompetitionEntry = (id) => {
  const data = getCompetitionData();
  const target = data.find(item => item.id === id);
  const updated = data.filter(item => item.id !== id);
  saveCompetitionData(updated);
  if (target) {
    addActivityLog(`${target.college} ${target.department} 데이터가 삭제되었습니다.`, 'data');
  }
  return updated;
};

// 설문조사 데이터 가져오기
export const getSurveys = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(SURVEY_STORAGE_KEY));
};

// 설문지 저장
export const saveSurveys = (surveys) => {
  localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(surveys));
};

// 설문 응답 제출
export const submitSurveyResponse = (surveyId, responseAnswers) => {
  const surveys = getSurveys();
  const updated = surveys.map(survey => {
    if (survey.id === surveyId) {
      const responses = [...(survey.responses || []), responseAnswers];
      addActivityLog(`"${survey.title}" 설문에 새로운 응답이 제출되었습니다.`, 'survey');
      return { ...survey, responses };
    }
    return survey;
  });
  saveSurveys(updated);
  return updated;
};

// 새로운 설문 조사 만들기
export const createSurvey = (title, description, questions) => {
  const surveys = getSurveys();
  const newSurveyId = `survey-${Date.now()}`;
  const newSurvey = {
    id: newSurveyId,
    title,
    description,
    questions,
    responses: []
  };
  const updated = [...surveys, newSurvey];
  saveSurveys(updated);
  addActivityLog(`새로운 설문조사 "${title}"가 생성되었습니다.`, 'survey');
  return updated;
};

// 활동 로그 가져오기
export const getActivityLogs = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY)) || [];
};

// 활동 로그 추가
export const addActivityLog = (message, type = 'system') => {
  const logs = JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY)) || [];
  const newLog = {
    time: new Date().toISOString(),
    message,
    type
  };
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([newLog, ...logs].slice(0, 50))); // 최대 50개 유지
};
