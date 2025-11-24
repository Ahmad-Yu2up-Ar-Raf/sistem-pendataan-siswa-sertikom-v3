import * as React from "react"
import 
{  
 type LucideIcon, 

} from "lucide-react"

import { Sun, Moon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { Link } from "@inertiajs/react";

import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
export default function NavSecondary({
  isMobile,
  items,

  ...props
}: {
  isMobile: boolean
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]

} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  

  
    const { appearance, updateAppearance } = useAppearance();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = appearance === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        updateAppearance(newMode);
        return;
      }

      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        updateAppearance(newMode);
      });
    },
    [appearance, updateAppearance]
  );

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu className="relative">
           

            <SidebarMenuItem>
              <SidebarMenuButton 
                className="cursor-pointer"  
                asChild 
                size="sm" 
                tooltip={"Theme"}
              >
                <Button variant={"ghost"} className=" w-full  flex justify-start" onClick={handleThemeToggle}>
                  <ModeToggle />
                  <span>Tema</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
     
    </>
  )
}










export function ModeToggle() {
 
  return (
 
    <span
    className="  relative    "
    
    
  >
    <Sun className="size-4 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
    <Moon className="absolute top-0 size-4 rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
    <span className="sr-only">Switch Theme</span>
  </span>
    
  );
}