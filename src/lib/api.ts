import type { AskResult, MainCategory } from '../types';

const BASE = 'http://127.0.0.1:8000';

export async function askServer(
  main: MainCategory,
  subs: string[],
  question: string
): Promise<AskResult> {
  if (question.trim().startsWith('/메뉴')) {
    return post('/menu', { question });
  }
  const endpoint = ({ yoram:'/yoram', info:'/info', announcement:'/announcement', menu:'/menu' } as const)[main];
  const payload: any = { question, add_intro: true }; // 필요 시 false로 보내면 인사 제거
  if (main === 'yoram' || main === 'announcement') payload.departments = subs;
  if (main === 'info') payload.topics = subs;
  return post(endpoint, payload);
}

async function post(path: string, body: any): Promise<AskResult> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const data = await res.json().catch(() => ({}));
  return {
    answer: data?.answer ?? data?.llm_answer ?? '',
    error: data?.error ?? null,
    sources: data?.sources ?? [],
    clarification: data?.clarification ?? null,
  };
}