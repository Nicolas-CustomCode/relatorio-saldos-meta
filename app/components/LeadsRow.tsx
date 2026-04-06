import type { LeadData } from "@/src/types/business";

export default function LeadsRow({ data }: { data: LeadData }) {
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <tr className="hover:bg-surface-container-high transition-colors">
            <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">{data.id}</td>
            <td className="px-6 py-5 text-sm font-semibold text-on-surface">{data.bm}</td>
            <td className="px-6 py-5 text-sm font-bold text-center text-primary">{data.total}</td>
            <td className="px-6 py-5 text-xs text-on-surface-variant text-right">{formattedDate}</td>
        </tr>
    );
}
