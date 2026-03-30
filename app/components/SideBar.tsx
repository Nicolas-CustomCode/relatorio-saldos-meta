'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './Buttons'
import styles from '@/src/styles/components/sideBar.module.css'

export default function SideBar() {
    const pathname = usePathname()

    return (
        <aside className={styles.aside}>
            <Link className={pathname === '/dashboard' ? styles.active : ''} href={'/dashboard'}>
                Dashboard
            </Link>

            <Link className={pathname === '/edit' ? styles.active : ''} href={'/edit'}>
                Edit
            </Link>
        </aside>
    )
}
