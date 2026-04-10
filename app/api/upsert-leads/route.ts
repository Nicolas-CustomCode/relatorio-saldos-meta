import { upsertLeadInfo } from "@/src/repositories/upsertLeadInfo"
import type { LeadInfo } from "@/src/types/rdStation"
import type { LeadsReq } from "@/src/types/rdStation"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const res: LeadsReq = await req.json()

    const data: LeadInfo = {
        name: res.leads?.[0].name!,
        phone: res.leads?.[0].personal_phone!
    }

    await upsertLeadInfo(data)

    return NextResponse.json({ ok: true })
}
