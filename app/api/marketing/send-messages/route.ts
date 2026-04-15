// Rota que busca os leads da RD Station e envia uma mensagem para cada um

import { listRdStationLeads } from "@/src/repositories/listRdStationLeads";
import { getRdStationMessage } from "@/src/services/getRdStationMessage";
import { sendMessage } from "@/src/services/sendMessage";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const eventDate = new Date(2026, 3, 10)
    const today = new Date()

    const diff = eventDate.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    console.log(`Days = ${days}\nHours = ${today.getHours()}`)

    if (![7, 4, 1, 0, -1, -3, -4, -5].includes(days)) return NextResponse.json({ success: false, error: 'Não é o dia de envio' })

    const message = await getRdStationMessage(days)

    const leads = await listRdStationLeads()

    if (!leads) return NextResponse.json({ success: false, error: 'Erro ao buscar leads' })

    for (const lead of leads) {
        await sendMessage(lead.phone, message)
    }

    return NextResponse.json({ success: true })
}
