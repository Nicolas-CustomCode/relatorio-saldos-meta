'use client'

import { pgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import { Button } from "../components/Buttons"
import styles from '@/src/styles/pages/dashboard.module.css'
import Table from "../components/Table"

export default function Dashboard() {
    const [businessList, setBusinessList] = useState<pgAccount[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const sortedList: pgAccount[] = [...businessList].sort((a, b) => (
        a.name.localeCompare(b.name)
    ))

    useEffect(() => {
        fetch('/api/get-balances')
            .then((r) => (r.json()))
            .then(setBusinessList)
    }, [])

    async function updateBalances() {
        try {
            setLoading(true)

            await fetch('/api/sync-balances')
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>RELATÓRIO DE SALDOS</h1>
                <p>Veja os saldos mais recentes das contas de anúncio que possui acesso!</p>
            </header>

            <section className={styles.tableSection}>
                <div className={styles.tableContainer}>
                    <Table data={sortedList}></Table>
                </div>
                <Button variant="primary" onClick={updateBalances} disabled={loading}>Atualizar</Button>
            </section>
        </main>
    )
}
