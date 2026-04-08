'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TopBar() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 w-full bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h2 className="text-sm font-semibold tracking-tight text-foreground">RD System</h2>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </header>
  )
}
