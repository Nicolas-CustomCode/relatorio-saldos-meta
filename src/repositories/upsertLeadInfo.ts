import { pool } from "../lib/db";
import type { LeadInfo } from "../types/rdStation";

export async function upsertLeadInfo(data:LeadInfo) {
    await pool.query(`
        INSERT INTO rdstation.leads (phone, name)
        VALUES ($1, $2)
        ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name
    `, [data.phone, data.name])
}
