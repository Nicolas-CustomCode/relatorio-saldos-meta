'use client'

import { useCallback, useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import type { DbLeadRes } from "@/src/types/rdStation"

export default function RdStation() {
    const defaultDate = (() => {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        return d.toISOString().split('T')[0]
    })()

    const [leadsList, setLeadsList] = useState<DbLeadRes[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    // Filters
    const [startDate, setStartDate] = useState<string>(defaultDate)
    const [endDate, setEndDate] = useState<string>(defaultDate)
    // const [leadFilter, setLeadFilter] = useState<string>('')

    const getLeadsList = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            // if (leadFilter) params.append('bm', leadFilter)

            const res = await fetch(`/api/list-leads-info`)
            const data = await res.json()

            setLeadsList(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getLeadsList()
    }, [getLeadsList])

    // const totalLeads = leadsList.reduce((acc, curr) => acc + Number(curr.total), 0)

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Relatório de Leads</h1>
                    <p className="text-muted-foreground">Desempenho de captação de leads por conta (BM).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* <MetricCard title="Total de Leads" value={totalLeads} icon={<Users className="h-5 w-5" />} /> */}
                {/* <MetricCard title="Registros Exibidos" value={leadsList.length.toString().padStart(2, '0')} icon={<List className="h-5 w-5" />} /> */}
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Listagem de Leads</h4>

                    <div className="flex flex-wrap gap-4 items-center w-full justify-end">
                        {/* <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Buscar Conta</label>
                            <input
                                type="text"
                                placeholder="Nome da conta..."
                                value={leadFilter}
                                onChange={(e) => setLeadFilter(e.target.value)}
                                className="bg-muted focus:ring-1 focus:ring-primary transition-all text-xs px-4 py-2 rounded-lg outline-none w-full min-w-[200px]"
                            />
                        </div> */}

                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">De</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="bg-muted focus:ring-1 focus:ring-primary transition-all text-xs px-4 py-2 rounded-lg outline-none"
                                />
                            </div>
                            <span className="text-muted-foreground self-end mb-2">-</span>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Até</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="bg-muted focus:ring-1 focus:ring-primary transition-all text-xs px-4 py-2 rounded-lg outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative min-h-[200px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-1/4">Nome</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-1/3">Telefone</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-1/3">Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leadsList.map((lead, index) => {
                                const formattedDate = new Date(lead.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    timeZone: 'UTC'
                                });

                                return (
                                    <TableRow key={`${lead.phone}-${index}`}>
                                        <TableCell className="px-4 py-4 text-sm font-semibold">{lead.phone}</TableCell>
                                        <TableCell className="px-4 py-4 text-sm font-semibold">{lead.name}</TableCell>
                                        <TableCell className="px-4 py-4 text-sm font-semibold">{formattedDate}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {leadsList.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                                        Nenhum lead encontrado para os filtros selecionados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {loading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-card border p-6 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{title}</p>
            <div className="flex items-center justify-between">
                <h3 className="text-4xl font-black">{value}</h3>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {icon}
                </div>
            </div>
        </div>
    )
}
