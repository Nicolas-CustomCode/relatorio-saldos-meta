'use client'

import { SetStateAction, useState } from "react"
import type { dbBusinessMessaging, FetchGroups } from "@/src/types/evolution"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MessageSquare, List, Zap, Save, RefreshCw, X, Edit3 } from "lucide-react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ───────────────────────────────────────────────────────────────────

type MensagensData = {
    combined: dbBusinessMessaging[]
    groups: FetchGroups[]
}

// ─── MessagingRow ─────────────────────────────────────────────────────────────

function MessagingRow({ data, groups }: { data: dbBusinessMessaging, groups: FetchGroups[] }) {
    const queryClient = useQueryClient()
    const [persistedData, setPersistedData] = useState(data)
    const [message, setMessage] = useState(data.message || "")
    const [phone, setPhone] = useState(data.phone || "")
    const [format, setFormat] = useState<'semanal' | 'diario'>(data.format || "diario")
    const [weekdays, setWeekdays] = useState<number[]>(data.weekdays || [])
    const [active, setActive] = useState(data.active ?? false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const isDirty =
        message !== (persistedData.message || "") ||
        phone !== (persistedData.phone || "") ||
        format !== (persistedData.format || "diario") ||
        active !== (persistedData.active ?? false) ||
        JSON.stringify(weekdays) !== JSON.stringify(persistedData.weekdays || [])

    const daysOptions = [
        { label: 'D', value: 0 }, { label: 'S', value: 1 }, { label: 'T', value: 2 },
        { label: 'Q', value: 3 }, { label: 'Q', value: 4 }, { label: 'S', value: 5 }, { label: 'S', value: 6 }
    ]

    const handleDayToggle = (day: number) => {
        setWeekdays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort())
    }

    const saveMutation = useMutation({
        mutationFn: (payload: dbBusinessMessaging) => fetch('/api/upsert-messaging', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }),
        onSuccess: (_, payload) => {
            setPersistedData(payload)
            queryClient.invalidateQueries({ queryKey: ['mensagens-data'] })
        }
    })

    const handleSave = () => {
        saveMutation.mutate({ id: data.id, business: data.business, message, phone, format, weekdays, active })
    }

    const renderFormattedMessage = (text: string, isPreview: boolean) => {
        const parts = text.split(/(\*.*?\*|\{\{leads\}\})/g)
        return parts.map((part, i) => {
            if (part === '{{leads}}') return isPreview ? '127' : <span key={i} className="text-primary bg-primary/20 rounded-sm">{part}</span>
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                const content = part.slice(1, -1)
                return <strong key={i} className="font-bold">{isPreview ? content : part}</strong>
            }
            return part
        })
    }

    return (
        <TableRow className={isDirty ? "bg-amber-500/[0.02]" : ""}>
            <TableCell className="px-4 py-4 font-mono text-[10px] text-muted-foreground">{data.id}</TableCell>
            <TableCell className="px-4 py-4 font-semibold text-sm">{data.business}</TableCell>
            <TableCell className="px-4 py-4">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="w-full justify-start truncate max-w-[200px] text-xs">
                    <Edit3 className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{message || "Sua mensagem..."}</span>
                </Button>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-background p-6 rounded-xl border w-full max-w-2xl shadow-xl">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold">Editar Mensagem</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative h-40 bg-muted rounded-lg p-4 mb-4 overflow-y-auto">
                                <div className="absolute inset-0 p-4 whitespace-pre-wrap break-words pointer-events-none text-sm">
                                    {renderFormattedMessage(message, false)}
                                </div>
                                <textarea
                                    className="absolute inset-0 w-full h-full p-4 bg-transparent border-none text-transparent caret-foreground outline-none resize-none text-sm"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Sua mensagem..."
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">WhatsApp Preview</h4>
                                <div className="bg-[#e5ddd5] dark:bg-[#0b141a] p-4 rounded-lg flex flex-col items-end border">
                                    <div className="bg-[#dcf8c6] dark:bg-[#005c4b] text-[#303030] dark:text-[#e9edef] p-3 rounded-lg rounded-tr-none max-w-[90%] shadow-sm text-[13px] leading-relaxed">
                                        <div className="whitespace-pre-wrap break-words">{renderFormattedMessage(message || "Sua mensagem...", true)}</div>
                                        <div className="text-[9px] opacity-60 text-right mt-1 flex items-center justify-end gap-1">12:45 <span className="font-bold text-[#53bdeb] ml-1">✓✓</span></div>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => setIsModalOpen(false)}>Confirmar</Button>
                        </div>
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-4">
                <select value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-1.5 text-xs bg-background border rounded-md outline-none focus:ring-1 focus:ring-primary">
                    <option value="">Grupo...</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name || g.subject}</option>
                    ))}
                </select>
            </TableCell>
            <TableCell className="px-4 py-4">
                <select value={format} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value as SetStateAction<"semanal" | "diario">)} className="w-full p-1.5 text-xs bg-background border rounded-md outline-none focus:ring-1 focus:ring-primary">
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                </select>
            </TableCell>
            <TableCell className="px-4 py-4">
                <div className="flex gap-1 flex-wrap">
                    {daysOptions.map((day) => (
                        <button key={day.value} onClick={() => handleDayToggle(day.value)} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors ${weekdays.includes(day.value) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{day.label}</button>
                    ))}
                </div>
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 cursor-pointer" />
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <Button
                    size="icon"
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    variant={isDirty ? "default" : "outline"}
                    className={isDirty ? "bg-amber-500 hover:bg-amber-600 h-8 w-8" : "h-8 w-8"}
                >
                    {saveMutation.isPending ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                </Button>
            </TableCell>
        </TableRow>
    )
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <TableRow>
            {Array.from({ length: 8 }).map((_, i) => (
                <TableCell key={i} className="px-4 py-4">
                    <Skeleton className="h-4 w-full rounded" />
                </TableCell>
            ))}
        </TableRow>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Mensagens() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery<MensagensData>({
        queryKey: ['mensagens-data'],
        queryFn: () => fetch('/api/mensagens-data').then(r => r.json()),
        staleTime: 2 * 60 * 1000, // 2 min cache
    })

    const combined = data?.combined ?? []
    const groups = data?.groups ?? []

    const syncMutation = useMutation({
        mutationFn: () => fetch('/api/get-groups'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mensagens-data'] })
    })

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Mensagens Automáticas</h1>
                    <p className="text-muted-foreground">Configure os envios para cada conta.</p>
                </div>
                <Button variant="outline" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending} className="font-bold shadow-sm">
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                    {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar Grupos'}
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Configuradas" value={combined.length} icon={<MessageSquare className="h-5 w-5" />} loading={isLoading} />
                <MetricCard title="Grupos" value={groups.length} icon={<List className="h-5 w-5" />} loading={isLoading} />
                <MetricCard title="Ativos" value={combined.filter(d => d.active).length} icon={<Zap className="h-5 w-5" />} loading={isLoading} />
            </div>

            {/* Table */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gerenciador de Envio</h4>
                    {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">ID BM</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Conta</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Mensagem</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Grupo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Formato</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Dias</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Ativo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Salvar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                                : combined.map((msg) => (
                                    <MessagingRow key={msg.id} data={msg} groups={groups} />
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ title, value, icon, loading }: { title: string, value: number, icon: React.ReactNode, loading?: boolean }) {
    return (
        <div className="bg-card border p-6 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{title}</p>
            <div className="flex items-center justify-between">
                {loading
                    ? <Skeleton className="h-10 w-16 rounded" />
                    : <h3 className="text-4xl font-black">{value}</h3>
                }
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">{icon}</div>
            </div>
        </div>
    )
}
