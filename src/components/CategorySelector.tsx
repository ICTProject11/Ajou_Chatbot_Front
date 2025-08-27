// src/components/CategorySelector.tsx
import { MAIN_CATEGORIES, DEPARTMENTS, INFO_TOPICS } from '../lib/categories';
import type { MainCategory } from '../types';

type Props = {
  main: MainCategory;
  onMainChange: (m: MainCategory) => void;
  subs: string[];
  onToggleSub: (label: string) => void;
};

export default function CategorySelector({ main, onMainChange, subs, onToggleSub }: Props) {
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
        {main === 'info' && INFO_TOPICS.map(t => (
          <label key={t} className="checkitem">
            <input type="checkbox" checked={subs.includes(t)} onChange={()=> onToggleSub(t)} />
            <span>{t}</span>
          </label>
        ))}

        {(main === 'yoram' || main === 'announcement') && (
          <>
            {Object.entries(DEPARTMENTS).map(([college, list]) => (
              <div key={college} style={{border:'1px solid var(--border)',borderRadius:10,padding:8}}>
                <div style={{fontSize:13,color:'var(--muted)',marginBottom:6}}>{college}</div>
                <div className="checklist">
                  {list.map(dept => (
                    <label key={dept} className="checkitem">
                      <input type="checkbox" checked={subs.includes(dept)} onChange={()=> onToggleSub(dept)} />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {main === 'menu' && <div className="helper">식단은 하위 선택이 필요 없어요.</div>}
      </div>

      <div className="helper">
        • 대분류는 한 번에 하나만 선택됩니다.<br/>
        • 하위 항목은 최소 1개 이상 선택해야 전송할 수 있어요(식단 제외).
      </div>
    </aside>
  );
}