-- 기사 북마크를 저장하는 테이블
-- 실행 방법: npm run db:setup  (이미 있으면 건너뜀)

CREATE TABLE IF NOT EXISTS articles (
  id          SERIAL PRIMARY KEY,                                   -- 고유 번호 (자동 증가)
  title       TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  url         TEXT NOT NULL CHECK (url ~ '^https?://'),             -- http:// 또는 https:// 로 시작
  category    TEXT NOT NULL CHECK (category IN ('환경', '노동', '젠더', '교육', '주거', '기타')),
  memo        TEXT NOT NULL DEFAULT '' CHECK (char_length(memo) <= 200),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),                   -- 등록 시각
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()                    -- 마지막 수정 시각
);

-- 최신순 정렬을 빠르게 하기 위한 색인
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);
