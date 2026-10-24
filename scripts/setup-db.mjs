// db/schema.sql을 읽어서 Neon에 테이블을 만든다.
// 실행: npm run db:setup
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("❌ .env 파일에 DATABASE_URL이 없습니다.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// 주석(--)을 지우고 세미콜론(;) 기준으로 SQL 문장을 하나씩 나눈다.
const statements = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .replace(/--.*$/gm, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

try {
  for (const statement of statements) {
    await sql.query(statement);
  }
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM articles`;
  console.log(`✅ 연결 성공! articles 테이블이 준비됐습니다. (저장된 기사: ${count}개)`);
} catch (error) {
  console.error("❌ 데이터베이스 작업 실패:", error.message);
  process.exit(1);
}
