"use client"

import * as React from "react"

import {
  AudioWaveform,
  Box,
  BoxIcon,
  Calendar,
  Command,
  DoorOpen,
  GalleryVerticalEnd,
  GraduationCap,
  Heart,
  HomeIcon,
  LayoutDashboardIcon,
  LifeBuoy,
  PencilRuler,
  Send,
  ShoppingBag,
  Users2,
} from "lucide-react"

import { NavMain } from '@/components/ui/core/layout/app/fragments/nav-main';
import { NavUser } from '@/components/ui/core/layout/app/fragments/nav-user';
 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { type SharedData } from '@/types';
import NavSecondary  from "./nav-secondary";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePage } from "@inertiajs/react";

// Jika lucide-react tidak export type LucideIcon, kita definisikan sendiri:
import type { LucideIcon } from "lucide-react";
import { NavProjects } from "./nav-project";
import SidebarHeaderLogo from "./SidebarHeader";

export type IconType = LucideIcon;

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface SecondaryNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

interface DataShape {
  teams: Team[];

  main: NavItem[];
  projects: NavItem[];
 
  navSecondary: SecondaryNavItem[];
}

// Sekarang deklarasikan data dengan tipe yang jelas
const data: DataShape = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],


  main: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon, },
    { title: "Siswa", url: "/dashboard/siswa", icon: GraduationCap,  },
    { title: "Kelas", url: "/dashboard/kelas", icon: DoorOpen,  },
    { title: "Jurusan", url: "/dashboard/jurusan", icon: PencilRuler,  },
    { title: "Tahun Ajar", url: "/dashboard/tahun_ajar", icon: Calendar,  },

  ],

   projects: [
    {
      title: "Users",
      url: "/dashboard/admin",
      icon: Users2,
    },
    
  ],

  navSecondary: [
    { title: "Dukungan", url: "#", icon: LifeBuoy },
    { title: "Masukan", url: "#", icon: Send },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<SharedData>().props;
  const isMob = useIsMobile();


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderLogo user={auth}    />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data["main"]} />
        <NavProjects projects={data.projects} />
        <NavSecondary
          isMobile={isMob}
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}