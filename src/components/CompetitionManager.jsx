import React, { useState, useEffect } from 'react';
import { getCompetitionData, addCompetitionEntry, updateCompetitionEntry, deleteCompetitionEntry } from '../data/mockData';
import './CompetitionManager.css';

function CompetitionManager({ addNotification }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  
  // 체크박스 선택된 항목 ID 리스트
  const [checkedIds, setCheckedIds] = useState([]);
  
  // 모달 제어 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  
  // 폼 입력 데이터
  const [formData, setFormData] = useState({
    college: '',
    department: '',
    year: 2025,
    type: '수시1차',
    recruits: 10,
    applicants: 10
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, searchTerm, selectedYear, selectedType]);

  const loadData = () => {
    setData(getCompetitionData());
  };

  const filterData = () => {
    let result = [...data];
    
    if (searchTerm) {
      result = result.filter(item => 
        item.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedYear !== 'All') {
      result = result.filter(item => item.year === parseInt(selectedYear));
    }
    
    if (selectedType !== 'All') {
      result = result.filter(item => item.type === selectedType);
    }
    
    setFilteredData(result);
  };

  // 체크박스 제어
  const handleCheck = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(item => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedIds(filteredData.map(item => item.id));
    } else {
      setCheckedIds([]);
    }
  };

  // 폼 입력 관리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'recruits' || name === 'applicants' || name === 'year'
        ? parseInt(value) || 0
        : value
    }));
  };

  // 모달 열기 (등록)
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      college: '',
      department: '',
      year: 2025,
      type: '수시1차',
      recruits: 10,
      applicants: 10
    });
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const openEditModal = (item) => {
    setModalMode('edit');
    setEditId(item.id);
    setFormData({
      college: item.college,
      department: item.department,
      year: item.year,
      type: item.type,
      recruits: item.recruits,
      applicants: item.applicants
    });
    setIsModalOpen(true);
  };

  // 전형 등록/수정 서브밋
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.college.trim() || !formData.department.trim()) {
      addNotification('대학명과 학과명을 정확하게 입력해 주세요.', 'warning');
      return;
    }
    if (formData.recruits <= 0) {
      addNotification('모집 인원은 1명 이상이어야 합니다.', 'warning');
      return;
    }

    if (modalMode === 'add') {
      const updated = addCompetitionEntry(formData);
      setData(updated);
      addNotification(`${formData.college} 전형이 성공적으로 등록되었습니다.`, 'success');
    } else {
      const updated = updateCompetitionEntry(editId, formData);
      setData(updated);
      addNotification(`${formData.college} 전형 정보가 수정되었습니다.`, 'success');
    }
    setIsModalOpen(false);
  };

  // 데이터 삭제
  const handleDelete = (item) => {
    if (window.confirm(`${item.college} ${item.department} (${item.type}) 경쟁률 데이터를 정말 삭제하시겠습니까?`)) {
      const updated = deleteCompetitionEntry(item.id);
      setData(updated);
      setCheckedIds(checkedIds.filter(id => id !== item.id));
      addNotification('데이터가 삭제되었습니다.', 'info');
    }
  };

  // 비교할 수 있는 선택된 데이터 목록 추출
  const checkedData = data.filter(item => checkedIds.includes(item.id));

  return (
    <div className="competition-manager animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>경쟁률 비교 관리</h1>
          <p>전문대학별 다양한 입학전형 경쟁률을 비교하고, 데이터를 편리하게 관리합니다.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ 전형 데이터 등록
          </button>
        </div>
      </div>

      {/* 필터링 바 */}
      <div className="card filter-card">
        <div className="filter-grid">
          <div className="form-group search-group">
            <label className="form-label">검색어</label>
            <input
              type="text"
              className="form-control"
              placeholder="대학명 또는 학과명 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">학년도</label>
            <select
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">전체 학년도</option>
              <option value="2026">2026학년도</option>
              <option value="2025">2025학년도</option>
              <option value="2024">2024학년도</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">전형 구분</label>
            <select
              className="form-control"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">전체 전형</option>
              <option value="수시1차">수시 1차</option>
              <option value="수시2차">수시 2차</option>
              <option value="정시">정시</option>
            </select>
          </div>
        </div>
      </div>

      {/* 비교 분석 영역 (체크된 항목이 있을 때만 표시) */}
      {checkedData.length > 0 && (
        <div className="card comparison-card card-accent animate-fade-in">
          <div className="comparison-header">
            <div>
              <h3>체크 항목 비교 분석 뷰 ({checkedData.length}개 선택됨)</h3>
              <span className="comparison-subtitle">선택하신 전형의 모집 규모와 실시간 경쟁률을 대조합니다.</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setCheckedIds([])}>
              선택 초기화
            </button>
          </div>
          <div className="comparison-grid">
            {checkedData.map(item => {
              // 전체 선택된 항목 중 최대 경쟁률을 찾아 비율 계산
              const maxRate = Math.max(...checkedData.map(d => d.rate));
              const relativeWidth = maxRate > 0 ? (item.rate / maxRate) * 100 : 0;
              
              return (
                <div key={item.id} className="comp-item-card">
                  <div className="comp-item-title">
                    <h4>{item.college}</h4>
                    <span className="comp-item-dept">{item.department}</span>
                  </div>
                  <div className="comp-item-badges">
                    <span className="badge badge-primary">{item.year}년</span>
                    <span className="badge badge-success">{item.type}</span>
                  </div>
                  <div className="comp-item-stats">
                    <div className="comp-stat-row">
                      <span>모집 인원</span>
                      <strong>{item.recruits}명</strong>
                    </div>
                    <div className="comp-stat-row">
                      <span>지원 인원</span>
                      <strong>{item.applicants}명</strong>
                    </div>
                    <div className="comp-stat-row rate-row">
                      <span>경쟁률</span>
                      <strong className="rate-text">{item.rate.toFixed(2)}:1</strong>
                    </div>
                  </div>
                  <div className="comp-bar-container" title={`상대 비중: ${relativeWidth.toFixed(0)}%`}>
                    <div className="comp-bar" style={{ width: `${relativeWidth}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 데이터 테이블 */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th width="40" style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={filteredData.length > 0 && checkedIds.length === filteredData.length}
                    onChange={handleCheckAll}
                  />
                </th>
                <th>대학명</th>
                <th>학과명</th>
                <th>학년도</th>
                <th>전형 구분</th>
                <th>모집 인원</th>
                <th>지원 인원</th>
                <th>경쟁률</th>
                <th width="150" style={{ textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} className={checkedIds.includes(item.id) ? 'row-checked' : ''}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(item.id)}
                      onChange={() => handleCheck(item.id)}
                    />
                  </td>
                  <td className="cell-bold">{item.college}</td>
                  <td>{item.department}</td>
                  <td><span className="badge badge-primary">{item.year}학년도</span></td>
                  <td><span className="badge badge-success">{item.type}</span></td>
                  <td>{item.recruits}명</td>
                  <td>{item.applicants}명</td>
                  <td className="cell-rate">{item.rate.toFixed(2)}:1</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(item)} title="수정">
                        ✏️
                      </button>
                      <button className="btn btn-secondary btn-sm btn-delete" onClick={() => handleDelete(item)} title="삭제">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="9" className="table-empty">
                    필터 조건과 일치하는 경쟁률 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 등록 및 수정 팝업 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? '새 전형 데이터 등록' : '전형 데이터 수정'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">전문대학명 *</label>
                  <input
                    type="text"
                    name="college"
                    className="form-control"
                    placeholder="예: 동양미래대학교"
                    value={formData.college}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">모집 학과명 *</label>
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="예: 컴퓨터정보공학과"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">학년도</label>
                    <select
                      name="year"
                      className="form-control"
                      value={formData.year}
                      onChange={handleInputChange}
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">전형 구분</label>
                    <select
                      name="type"
                      className="form-control"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="수시1차">수시1차</option>
                      <option value="수시2차">수시2차</option>
                      <option value="정시">정시</option>
                    </select>
                  </div>
                </div>
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label className="form-label">모집 인원 (명) *</label>
                    <input
                      type="number"
                      name="recruits"
                      className="form-control"
                      min="1"
                      value={formData.recruits}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">지원 인원 (명) *</label>
                    <input
                      type="number"
                      name="applicants"
                      className="form-control"
                      min="0"
                      value={formData.applicants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {formData.recruits > 0 && (
                  <div className="calc-rate-preview">
                    <span>예상 계산 경쟁률: </span>
                    <strong>{(formData.applicants / formData.recruits).toFixed(2)} : 1</strong>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? '등록하기' : '수정 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetitionManager;
