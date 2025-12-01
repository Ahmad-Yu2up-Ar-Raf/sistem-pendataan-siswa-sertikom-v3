import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}


export type PagePropsOverview = {
    reports : Reports
 }



export interface TopJurusan{
    nama_jurusan: string;
    siswas_count: number;
}

export interface Reports {
  totalTahunAjar: number;
  totalJurusan: number;
  topJurusan: TopJurusan[]
  totalSiswa: number;
  totalKelas: number;
  KelastatusCount: Record<string, number>;
  SiswastatusCount: Record<string, number>;
  StatusJurusanCount: Record<string, number>;
  TahunAjarstatusCount: Record<string, number>;

  countsByDate: ChartDataType[];
}


export interface DataCard { 
    title: string;
    description: string;
    value: number | number;
    icon: LucideIcon;
   label?: string;
  }
  

export interface OptionItem {
    value: string;
    label: string;
    icon: LucideIcon;
    subLabel?: string;
    description?: string;
    image?: string;
    
    [key: string]: string | number | undefined | LucideIcon;
  }
  
export interface ChartDataType {
    date: string;
   
    orders?: number;
    revenue?: number;
    [key: string]: number; 
  }


export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    foto?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles : string
    [key: string]: unknown; // This allows for additional properties...
}


export interface sidebarType {  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}




export interface PaginatedData {
  
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
     hasMore: boolean;
    [key: string]: unknown;
}


// Add to existing types/index.d.ts

import { DateRange } from "react-day-picker";

export interface Filters {
    search: string;
    status?: string[] | string;
    agama?: string[] | string;
    jenis_kelamin?: string[] | string;
    jurusan?: string[] | number[];
    kelas?: string[] | number[];
    tahun_ajar?: string[] | number[];
    created_at?: DateRange;
    [key: string]: string | string[] | number[] | DateRange | undefined;
}

export interface Meta {
    filters : Filters
    pagination : PaginatedData
}

export interface ApiResponse {
    status: boolean;
    // ProductscategoryCount: Record<string, number>;
    message: string;
    meta: Meta;
    // data?: ProductsSchema[];
   
  }



export interface MultiEnumFilterProps {
  column: string;
  title: string;
  options: OptionItem[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
}