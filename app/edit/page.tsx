'use client'

import { pgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import styles from '@/src/styles/pages/dashboard.module.css'
import EditTable from "../components/EditTable"

export default function Dashboard() {
    const [businessList, setBusinessList] = useState<pgAccount[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const sortedList: pgAccount[] = [...businessList].sort((a, b) => (
        a.name.localeCompare(b.name)
    ))

    async function getBalances() {
        const res = await fetch('/api/get-balances')
        const data = await res.json()
        setBusinessList(data)
    }

    async function upsertAccounts() {
        try {
            setLoading(true)

            await fetch('/api/upsert-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(businessList)
            })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getBalances()
    }, [])

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>RELATÓRIO DE SALDOS</h1>
                <p>Veja os saldos mais recentes das contas de anúncio que possui acesso!</p>
            </header>

            <section className={styles.tableSection}>
                <div className={styles.tableContainer}>
                    <EditTable data={sortedList} onChange={setBusinessList}></EditTable>
                </div>

                <Button variant="primary" onClick={upsertAccounts} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
            </section>
        </main>
    )
}
