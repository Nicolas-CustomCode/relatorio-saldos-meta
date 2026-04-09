import { pool } from "@/src/lib/db"
import { Business } from "@/src/types/business"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Single connection, 3 parallel queries
        const [businessesRes, groupsRes, messagingRes] = await Promise.all([
            pool.query(`SELECT * FROM meta.businesses ORDER BY name`),
            pool.query(`SELECT * FROM meta.groups`),
            pool.query(`SELECT * FROM meta.messaging`)
        ])

        const businesses = businessesRes.rows
        const groups = groupsRes.rows
        const messaging = messagingRes.rows

        const combined = businesses.map((bm: Business) => {
            const config = messaging.find((m: Business) => m.id === bm.id)
            return {
                id: bm.id,
                business: bm.name,
                phone: config?.phone || "",
                message: config?.message || "",
                weekdays: config?.weekdays || [],
                format: config?.format || "diario",
                active: config?.active ?? false
            }
        })

        return NextResponse.json({ combined, groups })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ combined: [], groups: [] }, { status: 500 })
    }
}
