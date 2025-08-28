// src/lib/categories.ts
import type { MainCategory } from '../types';

export const MAIN_CATEGORIES: { key: MainCategory; label: string }[] = [
  { key: 'yoram', label: '학과별 요람' },
  { key: 'info', label: '학사 공통' },
  { key: 'announcement', label: '공지사항' },
  { key: 'menu', label: '식단' },
];

export const DEPARTMENTS: Record<string, string[]> = {
  '공과대학': [
    '건축학과','교통시스템공학과','기계공학과','미래자동차연계전공','산업공학과',
    '응용화학생명공학과','화학공학과','첨단신소재공학과','환경안전공학과','건설시스템공학과',
    '융합시스템공학과','응용화학과',
  ],
  '소프트웨어융합대학': [
    '국방디지털융합학과','사이버보안학과','데이터보안 / 활용융합연계전공',
    '디지털미디어학과','소프트웨어학과','인공지능융합학과',
  ],
};

// 학사공통 계층적 구조 정의
export const INFO_CATEGORIES: Record<string, Record<string, string[]>> = {
  '학칙': {
    '학사 규정': ['학적관리', '수업 및 성적', '졸업 규정', '학위 수여'],
    '생활 규정': ['학생 생활', '징계 규정', '포상 제도'],
  },
  '학사력': {
    '기본 정보': ['학사일정표', '대학이념', '교육목표', '인재상'],
    '대학 현황': ['연혁', '전체 기구표'],
  },
  '대학생활안내': {
    '학사 과정': ['교육과정', '전과', '수업/성적', '계절수업'],
    '학적 관리': ['등록/휴학/복학/졸업', '어학졸업인증제', '학석사연계과정'],
    '교류 및 지원': ['국내외학생교류제도', '기관안내'],
  },
};

export const DEFAULT_MAIN: MainCategory = 'info';