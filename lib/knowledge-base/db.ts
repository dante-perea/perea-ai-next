import { neon } from "@neondatabase/serverless";

export const sql = neon((process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!);
