// src/components/Chat.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import MessageBubble from './MessageBubble';
import { askServer } from '../lib/api';
import type { MainCategory, Message } from '../types';

type Props = { main: MainCategory; subs: string[] };

export default function Chat({ main, subs }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: nanoid(), role: 'bot', content: '안녕하세요! 왼쪽에서 질문 범위를 선택하고 물어보세요 🙂' },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => {
    if (pending) return false;
    if (main === 'menu') return input.trim().length > 0;
    return input.trim().length > 0 && subs.length > 0;
  }, [input, pending, main, subs.length]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  const typeOut = useCallback((full: string) => {
    const id = nanoid();
    let i = 0;
    setMessages(prev => [...prev.filter(m => !m.pending), { id, role:'bot', content:'' }]);
    const timer = setInterval(() => {
      i += Math.max(1, Math.floor(full.length / 200));
      setMessages(prev => prev.map(m => m.id === id ? ({ ...m, content: full.slice(0, i) }) : m));
      if (i >= full.length) clearInterval(timer);
    }, 14);
  }, []);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    if (main !== 'menu' && subs.length === 0 && !q.startsWith('/메뉴')) {
      setMessages(prev => [...prev, { id:nanoid(), role:'bot', content:'제게 물어볼 것을 선택해주세요. (왼쪽에서 최소 1개)' }]);
      return;
    }
    setMessages(prev => [...prev, { id:nanoid(), role:'user', content:q }]);
    setInput('');
    setPending(true);

    const loadingId = nanoid();
    setMessages(prev => [...prev, { id:loadingId, role:'bot', content:'', pending:true }]);

    try {
      const res = await askServer(main, subs, q);
      const answer = res.error ? `오류: ${res.error}` : (res.answer?.trim() || '빈 응답');
      typeOut(answer);
    } catch (e: any) {
      typeOut(`네트워크 오류: ${String(e?.message || e)}`);
    } finally {
      setPending(false);
      setMessages(prev => prev.filter(m => m.id !== loadingId));
    }
  }, [input, main, subs, typeOut]);

  return (
    <div className="main">
      <div className="header">
        <div className="logo" />
        <div>
          <div className="title">Ajou Admissions Chat</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Ajou Blue 기반 · 대학 입시/학사 안내 챗봇</div>
        </div>
      </div>

      <div className="content">
        <div ref={chatRef} className="chat">
          {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
        </div>

        <div className="inputbar">
          <input
            type="text"
            placeholder={main === 'menu' ? '예) 오늘 식단 알려줘 / "/메뉴"' : '질문을 입력하세요 (Enter 전송)'}
            value={input}
            onChange={e=> setInput(e.target.value)}
            onKeyDown={e=> { if (e.key === 'Enter' && !e.shiftKey && canSend) { e.preventDefault(); send(); } }}
            disabled={pending}
          />
          <button onClick={send} disabled={!canSend}>보내기</button>
        </div>
      </div>
    </div>
  );
}