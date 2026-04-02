import { insertLeads } from "@/src/repositories/insertLeads";
import { listBusinesses } from "@/src/repositories/listBusinesses";
import { getAdAccounts } from "@/src/services/getAdAccounts";
import { getDailyLeads } from "@/src/services/getDailyLeads";
import { AdAccountsResponse, BmLead } from "@/src/types/business";
import { NextResponse } from "next/server";

export async function GET() {
    const businesses = await listBusinesses()

    for (const business of businesses) {
        const accounts: AdAccountsResponse = await getAdAccounts(business)

        let leadCount: number = 0

        business.id === '681359605568422' && console.log(business)

        for (const account of accounts.data) {
            const leads = await getDailyLeads(account.id)

            business.id === '681359605568422' && console.log('leads = ', leads.data?.[0]?.actions?.[0]?.value)

            leadCount += Number(leads.data?.[0]?.actions?.[0]?.value ?? 0)
        }

        const businessLeads: BmLead = {
            id: business.id,
            bm: business.name,
            total: leadCount
        }

        insertLeads(businessLeads)
    }

    return NextResponse.json({ ok: true })
}
