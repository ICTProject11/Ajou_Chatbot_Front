// src/components/CategorySelector.tsx

import { MAIN_CATEGORIES, DEPARTMENTS, INFO_CATEGORIES } from '../lib/categories';
import type { InfoPath, MainCategory } from '../types';

type Props = {
  main: MainCategory;
  onMainChange: (m: MainCategory) => void;
  subs: string[];
  onToggleSub: (label: string) => void;
  onToggleInfoPath?: (p: InfoPath) => void;
};

export default function CategorySelector({ main, onMainChange, subs, onToggleSub, onToggleInfoPath }: Props) {
  return (
    <aside className="sidebar">
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
        <div style={{width:8,height:28,background:'var(--ajou-blue)',borderRadius:999}}/>
        <div style={{fontWeight:800,fontSize:18}}>질문 범위 선택</div>
      </div>

      <div className="section-title">대분류 (1개만 선택)</div>
      <div className="card-group">
        {MAIN_CATEGORIES.map(c => {
          const active = c.key === main;
          return (
            <label key={c.key} className={`card ${active ? 'active' : ''}`}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <input type="radio" name="main-cat" checked={active} onChange={()=> onMainChange(c.key)} />
                <div style={{fontWeight:600}}>{c.label}</div>
              </div>
              {active ? <span className="badge">선택됨</span> : null}
            </label>
          );
        })}
      </div>

      <div className="section-title" style={{marginTop:16}}>하위 선택 (복수 가능)</div>
      <div className="checklist">
        {/* 학사공통 계층적 선택 */}
        {main === 'info' && (
          <>
            {Object.entries(INFO_CATEGORIES).map(([majorCategory, middleCategories]) => (
              <div key={majorCategory} style={{
                border:'1px solid rgba(255,255,255,0.2)',
                borderRadius:10,
                padding:12,
                marginBottom:8,
                background:'rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  fontSize:14,
                  fontWeight:600,
                  color:'rgba(255,255,255,0.9)',
                  marginBottom:8,
                  borderBottom:'1px solid rgba(255,255,255,0.1)',
                  paddingBottom:4
                }}>
                  {majorCategory}
                </div>
                
                {Object.entries(middleCategories).map(([middleCategory, items]) => (
                  <div key={middleCategory} style={{marginBottom:8}}>
                    <div style={{
                      fontSize:12,
                      color:'rgba(255,255,255,0.7)',
                      marginBottom:4,
                      marginLeft:8
                    }}>
                      {middleCategory}
                    </div>
                    <div className="checklist" style={{marginLeft:16}}>
                      {items.map(item => (
                        <label key={item} className="checkitem" style={{padding:'8px 10px'}}>
                          <input 
                            type="checkbox" 
                            checked={subs.includes(item)} 
                            onChange={() => (onToggleInfoPath ? onToggleInfoPath({ major: majorCategory, middle: middleCategory, item }) : onToggleSub(item))} 
                          />
                          <span style={{fontSize:13}}>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="helper" style={{marginTop:12}}>
              학사공통은 학칙, 학사일정, 졸업요건 등 전반적인 학사 정보를 다룹니다. 
              원하는 세부 항목을 선택해서 더 정확한 답변을 받아보세요.
            </div>
          </>
        )}

        {/* 학과별 요람 및 공지사항 */}
        {(main === 'yoram' || main === 'announcement') && (
          <>
            {Object.entries(DEPARTMENTS).map(([college, list]) => (
              <div key={college} style={{
                border:'1px solid rgba(255,255,255,0.2)',
                borderRadius:10,
                padding:12,
                marginBottom:8,
                background:'rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  fontSize:13,
                  color:'rgba(255,255,255,0.7)',
                  marginBottom:8,
                  fontWeight:500
                }}>
                  {college}
                </div>
                <div className="checklist">
                  {list.map(dept => (
                    <label key={dept} className="checkitem">
                      <input 
                        type="checkbox" 
                        checked={subs.includes(dept)} 
                        onChange={() => onToggleSub(dept)} 
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* 식단 */}
        {main === 'menu' && (
          <div className="helper">
            식단 정보는 하위 선택이 필요 없습니다. 바로 질문해 주세요!
          </div>
        )}
      </div>

      <div className="helper">
        • 대분류는 한 번에 하나만 선택됩니다.<br/>
        • 학과별 질문은 최소 1개 학과를 선택해야 합니다.<br/>
        • 학사공통은 세부 항목을 선택하면 더 정확한 답변을 받을 수 있어요.
      </div>
    </aside>
  );
}