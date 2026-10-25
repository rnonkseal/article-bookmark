# 📰 사회문제 기사 북마크

수업이나 리포트를 준비하면서 읽은 사회문제 기사를 한곳에 모아 정리하는 웹 앱입니다.

- **배포 주소**: (Vercel 배포 후 추가 예정)

## 주요 기능

| 기능 | 설명 |
|---|---|
| 기사 등록 | 링크, 제목, 카테고리, 한 줄 메모 입력. **링크를 넣으면 기사 제목을 자동으로 가져옴** |
| 목록 보기 | 등록한 기사를 최신순으로 표시 |
| 카테고리 필터 | 환경 · 노동 · 젠더 · 교육 · 주거 · 기타, 카테고리별 기사 수 표시 |
| 수정 | 등록한 기사의 내용 수정 |
| 삭제 | 확인 창을 거쳐 기사 삭제 |

- 입력값 검사: 빈 제목, `http(s)://`로 시작하지 않는 링크, 목록에 없는 카테고리는 저장되지 않고 한국어로 안내합니다. (서버와 데이터베이스에서 이중으로 검사)
- 휴대폰 화면과 다크 모드를 지원합니다.

## 사용 기술

- **Next.js 16** (App Router, Server Actions), React 19, JavaScript
- **Tailwind CSS 4**
- **Neon** (서버리스 PostgreSQL), `@neondatabase/serverless`
- **Vercel** (배포)

## 프로젝트 구조

```
app/
├── page.js                    목록 + 카테고리 필터 (/)
├── new/page.js                기사 등록 (/new)
├── articles/[id]/edit/page.js 기사 수정 (/articles/번호/edit)
├── actions.js                 서버 액션: 등록·수정·삭제·제목 가져오기
├── error.js / not-found.js    오류 화면 / 404 화면
└── layout.js                  공통 틀
components/                    ArticleCard, ArticleForm, CategoryFilter, DeleteButton
lib/                           DB 연결, 카테고리 목록, 제목 가져오기, 번호 검사
db/schema.sql                  articles 테이블 정의
scripts/setup-db.mjs           테이블 생성 스크립트
```

## 데이터베이스 (`articles` 테이블)

| 칸 | 형태 | 설명 |
|---|---|---|
| `id` | 정수 (자동 증가) | 기사 번호 |
| `title` | 글자 (1~200자) | 제목 |
| `url` | 글자 (`http(s)://`로 시작) | 기사 링크 |
| `category` | 글자 (6개 중 하나) | 카테고리 |
| `memo` | 글자 (0~200자) | 한 줄 메모 |
| `created_at` / `updated_at` | 날짜+시간 | 등록 / 마지막 수정 시각 |

## 내 컴퓨터에서 실행하기

1. [Node.js](https://nodejs.org) (LTS)를 설치합니다.
2. 이 저장소를 내려받고 필요한 도구를 설치합니다.
   ```bash
   npm install
   ```
3. [Neon](https://neon.tech)에서 데이터베이스를 만들고, `.env.example`을 복사해 `.env` 파일을 만든 뒤 연결 주소를 넣습니다.
   ```bash
   cp .env.example .env
   ```
4. 테이블을 만들고 개발 서버를 켭니다.
   ```bash
   npm run db:setup
   npm run dev
   ```
5. 브라우저에서 http://localhost:3000 을 엽니다.

> `.env` 파일에는 데이터베이스 비밀번호가 들어 있으므로 GitHub에 올리지 않습니다. (`.gitignore`에 포함)

## 개발 기록

- [PLAN.md](PLAN.md): 처음 세운 계획서와 단계별 진행 상황
- [DEVLOG.md](DEVLOG.md): 개발 중 생긴 문제와 수정 요청, 해결 과정 기록

## 한계와 개선할 점

- 로그인 기능이 없어서, 배포 주소를 아는 사람은 누구나 기사를 등록·수정·삭제할 수 있습니다. → 로그인 기능을 추가하면 개인별로 기사를 관리할 수 있습니다.
- 로그인이 필요하거나 자동 접속을 막는 뉴스 사이트에서는 제목을 자동으로 가져오지 못할 수 있습니다. (이 경우 직접 입력)
