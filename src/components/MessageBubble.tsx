// src/components/MessageBubble.tsx
import React from 'react';
import type { Message } from '../types';
import TypingDots from './TypingDots';
import ReactMarkdown, { Components } from 'react-markdown'; // Components를 import합니다.
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  msg: Message;
  isWelcome?: boolean;
}

// <a> 태그를 커스텀하여 렌더링하는 컴포넌트
const customLinkRenderer: Components['a'] = ({ href, children }) => {
  // href가 외부 링크(http, https)인지 확인
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  
  // 외부 링크인 경우 새 탭에서 열리도록 속성 추가
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  // 내부 링크는 기존 방식대로 렌더링
  return <a href={href}>{children}</a>;
};

export default function MessageBubble({ msg, isWelcome = false }: MessageBubbleProps) {
  const className = `bubble ${msg.role === 'user' ? 'from-user' : 'from-bot'}${isWelcome ? ' welcome-message' : ''}`;
  
  if (msg.pending) {
    return (
      <div className="bubble from-bot typing">
        <TypingDots />
      </div>
    );
  }
  
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: customLinkRenderer }} // 여기서 <a> 태그 렌더링 방식을 재정의합니다.
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  );
}