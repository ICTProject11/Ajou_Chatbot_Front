import React from 'react';
import type { Message } from '../types';
import TypingDots from './TypingDots';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ msg }: { msg: Message }) {
  const className = `bubble ${msg.role === 'user' ? 'from-user' : 'from-bot'}`;
  if (msg.pending) return <div className={className}><TypingDots/></div>;
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
    </div>
  );
}