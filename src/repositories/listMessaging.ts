import { pool } from "@/src/lib/db"
import { dbBusinessMessaging } from "../types/evolution"

export async function listMessaging(): Promise<dbBusinessMessaging[]> {
    const res = await pool.query(
        `SELECT * FROM meta.messaging`
    )

    return res.rows
}
