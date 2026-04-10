"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import logo from "@/public/logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BarChart2,
  Users,
  MessageSquare,
  RefreshCw,
  LogOut,
} from "lucide-react"
import Image from "next/image"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSyncing, setIsSyncing] = React.useState(false)

  if (pathname === '/login') return null

  const trafficItems = [
    { name: 'Saldos', href: '/trafego/saldos', icon: BarChart2 },
    { name: 'Leads', href: '/trafego/leads', icon: Users },
    { name: 'Mensagens', href: '/trafego/mensagens', icon: MessageSquare },
  ]
  
  const rdStationItems = [
    { name: 'Mensagens', href: '/rd-station/leads', icon: MessageSquare },
  ]

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const res = await fetch('/api/get-businesses')
      if (res.ok) {
        alert('BMs sincronizados com sucesso!')
        router.refresh()
      } else {
        alert('Erro ao sincronizar BMs.')
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao sincronizar BMs.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image src={logo} alt="RD System" width={32} height={32} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold uppercase tracking-widest text-xs">RD System</span>
                  <span className="text-[10px] opacity-70 uppercase">Painel de Relatórios</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tráfego Pago</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trafficItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>RD Station</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rdStationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSync}
              disabled={isSyncing}
              tooltip={isSyncing ? "Sincronizando..." : "Sincronizar BMs"}
            >
              <RefreshCw className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar BMs"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
