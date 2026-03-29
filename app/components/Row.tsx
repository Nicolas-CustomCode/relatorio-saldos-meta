import { pgAccount } from '@/src/types/business'

export default function Row({ data }: { data: pgAccount }) {
    return (
        <tr>
            <td><p>{data.id}</p></td>
            <td><p>{data.name}</p></td>
            <td><p>{data.minimum || null}</p></td>
            <td><p>{data.balance}</p></td>
            <td><p>{data.status}</p></td>
            <td><p>{data.updated}</p></td>
            <td><p></p></td>
        </tr>
    )
}
