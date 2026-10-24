import { neon } from "@neondatabase/serverless";

// .env 파일의 DATABASE_URL로 Neon에 연결한다.
// 사용 예: const rows = await sql`SELECT * FROM articles`;
export const sql = neon(process.env.DATABASE_URL);
