import { pool } from "@/src/lib/db"
import { upsertAccounts } from "@/src/repositories/upsertAccounts"
import { pgAccount } from "@/src/types/business"

export async function POST(req: Request) {
    const accounts: pgAccount[] = await req.json()

    try {
        for (const account of accounts) {
            await upsertAccounts(account)
        }

        return Response.json({ ok: true })
    } catch (err) {
        console.error(err)
        return Response.json({ ok: false }, { status: 500 })
    }
}
