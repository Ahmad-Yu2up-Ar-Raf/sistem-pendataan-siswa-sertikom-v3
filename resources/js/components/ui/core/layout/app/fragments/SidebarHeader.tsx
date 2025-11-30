"use client"

 
import {  LucideIcon, Plus } from "lucide-react"


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, } from "@/components/ui/fragments/shadcn-ui/sidebar"
import { Auth } from "@/types"


 
import AppLogo from "./app-logo"


export default function SidebarHeaderLogo({
 
  user,
}: {
 
    user: Auth
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className=" bg-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl">
       <AppLogo/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sundress</span>
                <span className="truncate text-xs capitalize">{user.user.roles[0].replace(/_/g, ' ')}</span>
              </div>
            
            </SidebarMenuButton>
     
      </SidebarMenuItem>
    </SidebarMenu>
  )
}