// src/App.tsx

import { useCallback, useMemo, useState } from 'react';
import CategorySelector from './components/CategorySelector';
import Chat from './components/Chat';
import { DEFAULT_MAIN } from './lib/categories';
import type { MainCategory } from './types';
import './App.css';

export default function App() {
  const [main, setMain] = useState<MainCategory>(DEFAULT_MAIN);
  const [subs, setSubs] = useState<string[]>([]);

  const onMainChange = useCallback((m: MainCategory) => {
    setMain(m);
    // 대분류 변경 시 하위 선택 초기화
    setSubs([]);
  }, []);

  const onToggleSub = useCallback((label: string) => {
    setSubs(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]);
  }, []);

  const summary = useMemo(() => {
    if (main === 'menu') return '식단 (하위 선택 없음)';
    if (main === 'info') {
      if (subs.length === 0) return '학사공통 (세부 선택 권장)';
      if (subs.length <= 3) return `학사공통: ${subs.join(', ')}`;
      return `학사공통: ${subs.slice(0,2).join(', ')} 외 ${subs.length - 2}건`;
    }
    if (subs.length === 0) return '하위 항목을 선택하세요';
    if (subs.length <= 3) return subs.join(', ');
    return `${subs.slice(0,3).join(', ')} 외 ${subs.length - 3}건`;
  }, [main, subs]);

  return (
    <div className="app">
      <CategorySelector main={main} onMainChange={onMainChange} subs={subs} onToggleSub={onToggleSub}/>
      <Chat main={main} subs={subs}/>
    </div>
  );
}