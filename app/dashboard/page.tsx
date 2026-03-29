'use client'

import { pgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import styles from '@/src/styles/pages/dashboard.module.css'
import Table from "../components/Table"

export default function Dashboard() {
    const [businessList, setBusinessList] = useState<pgAccount[]>([])

    useEffect(() => {
        fetch('/api/get-balances')
            .then((r) => (r.json()))
            .then(setBusinessList)
    }, [])

    return (
        <main className={styles.main}>
            <Table data={businessList}></Table>
            <button onClick={() => fetch('/api/sync-balances')}>Aaaa</button>
        </main>
    )
}
