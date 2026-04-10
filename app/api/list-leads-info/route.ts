import { pool } from "@/src/lib/db";
import { DbLeadRes } from "@/src/types/rdStation";
import { NextResponse } from "next/server";
import { QueryResult } from "pg";

export async function GET() {
    const data: QueryResult<DbLeadRes[]> = await pool.query(`
        SELECT * FROM rdstation.leads
    `)

    return NextResponse.json(data.rows)
}
