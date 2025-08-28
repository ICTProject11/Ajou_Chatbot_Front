// src/components/Chat.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import MessageBubble from './MessageBubble';
import { askServer } from '../lib/api';
import type { InfoPath, MainCategory, Message } from '../types';

type Props = { main: MainCategory; subs: string[]; infoPaths?: InfoPath[] };

export default function Chat({ main, subs, infoPaths = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: nanoid(), 
      role: 'bot', 
      content: '안녕하세요! 아주대학교 학사 안내 AI입니다.\n\n왼쪽에서 질문 범위를 선택하고 궁금한 점을 물어보세요.',
      isWelcome: true
    },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => {
  if (pending) return false;
  if (main === 'menu') return input.trim().length > 0;
  if (main === 'info') return input.trim().length > 0; // 학사공통은 선택 없이도 가능
  return input.trim().length > 0 && subs.length > 0;
}, [input, pending, main, subs.length]);

  // 자동 스크롤
  useEffect(() => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        chatRef.current.scrollTo({ 
          top: scrollHeight, 
          behavior: 'smooth' 
        });
      }
    }
  }, [messages, pending]);

  const typeOut = useCallback((full: string) => {
    const id = nanoid();
    let i = 0;
    
    setMessages(prev => [...prev.filter(m => !m.pending), { id, role:'bot', content:'' }]);
    
    const timer = setInterval(() => {
      const increment = Math.max(1, Math.floor(full.length / 150));
      i += increment;
      
      setMessages(prev => prev.map(m => 
        m.id === id ? ({ ...m, content: full.slice(0, i) }) : m
      ));
      
      if (i >= full.length) {
        clearInterval(timer);
      }
    }, 20);
  }, []);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    
    // 범위 선택 확인 (학사공통 제외)
    if (main === 'yoram' && subs.length === 0) {
      setMessages(prev => [...prev, { 
        id: nanoid(), 
        role: 'bot', 
        content: '학과별 요람 정보를 확인하려면 먼저 학과를 선택해 주세요.\n\n왼쪽에서 원하는 학과를 선택한 후 질문해 주세요.' 
      }]);
      return;
    }
    
    if (main === 'announcement' && subs.length === 0) {
      setMessages(prev => [...prev, { 
        id: nanoid(), 
        role: 'bot', 
        content: '공지사항을 확인하려면 먼저 학과를 선택해 주세요.\n\n왼쪽에서 원하는 학과를 선택한 후 질문해 주세요.' 
      }]);
      return;
    }

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { id: nanoid(), role: 'user', content: q }]);
    setInput('');
    setPending(true);

    try {
      const res = await askServer(main, subs, q, infoPaths);
      
      let answer = '';
      if (res.error) {
        answer = `죄송합니다. 처리 중 오류가 발생했습니다.\n\n오류 내용: ${res.error}\n\n잠시 후 다시 시도해 주세요.`;
      } else if (res.answer?.trim()) {
        answer = res.answer.trim();
      } else {
        answer = '죄송합니다. 응답을 생성할 수 없습니다.\n다시 질문해 주세요.';
      }
      
      typeOut(answer);
      
    } catch (e: any) {
      const errorMsg = `네트워크 연결에 문제가 발생했습니다.\n\n${String(e?.message || e)}\n\n인터넷 연결을 확인하고 다시 시도해 주세요.`;
      typeOut(errorMsg);
    } finally {
      setPending(false);
    }
  }, [input, main, subs, infoPaths, typeOut]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      e.preventDefault();
      send();
    }
  }, [send, canSend]);

  return (
    <div className="main">
      <div className="header">
        <div className="logo" data-loaded="true" />
        <div>
          <div className="title">아주대 학사 도우미</div>
          <div>궁금한 점을 언제든 물어보세요!</div>
        </div>
      </div>

      <div className="content">
        <div ref={chatRef} className="chat">
          {messages.map(m => (
            <MessageBubble 
              key={m.id} 
              msg={m} 
              isWelcome={m.isWelcome} 
            />
          ))}
          {pending && (
            <div className="bubble from-bot typing">
              <div className="dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
        </div>

        <div className="inputbar">
          <input
            type="text"
            placeholder={
  main === 'menu' 
    ? '예) 오늘 식단 알려줘' 
    : main === 'info'
      ? '학사 관련 질문을 자유롭게 하세요... (세부 선택 시 더 정확)'
    : canSend 
      ? '궁금한 점을 자유롭게 질문하세요...' 
      : '왼쪽에서 학과를 먼저 선택해 주세요'
}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={pending}
            maxLength={500}
          />
          <button onClick={send} disabled={!canSend}>
            {pending ? '전송 중...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
}