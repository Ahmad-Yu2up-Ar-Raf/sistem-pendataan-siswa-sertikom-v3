"use client";
import React from "react";
import { SectionCards } from "@/components/ui/fragments/custom-ui/card/section-card";
import {
  Calendar,
  Calendar1Icon,
  CircleFadingArrowUp,
  DoorOpen,
  GraduationCap,
  Package,
  PencilRuler,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import { DataCard, PagePropsOverview } from "@/types";
import { ChartPie } from "@/components/ui/fragments/custom-ui/chart/chart-pie-donut";
import { ChartAreaInteractive } from "@/components/ui/fragments/custom-ui/chart/chart-area-interactive";
import { ChartBarActive } from "@/components/ui/fragments/custom-ui/chart/chart-bar-active";
 
function MainSection({ data }: { data: PagePropsOverview }) {
  const reports = data.reports;
 
const dataCards: DataCard[] = [
  {
    title: "Total TahunAjar",
    description: "Total Tahun Ajar kamu",
    value: reports.totalTahunAjar,
    icon: Calendar1Icon,
    label: "Tahun AJar",
  },
  {
    title: "Total Jurusan",
    description: "Total seluruh jurusan",
    value: reports.totalJurusan,
    icon: PencilRuler,
    label: "Jurusan",
  },
    {
    title: "Total Siswa",
    description: "Total seluruh siswa ",
    value: reports.totalSiswa,  
    icon: GraduationCap, 
    label: "Siswa",
  },
    {
    title: "Total Kelas",
    description: "Total seluruh kelas dari ",
    value: reports.totalKelas,  
    icon: DoorOpen, 
    label: "Kelas",
  },
 

];

  return (
    <>
      <section className="space-y-4">
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-4 md:gap-6">
            <SectionCards dataCards={dataCards} />
          </div>

          <div className=" grid grid-cols-1 sm:grid-cols-2    gap-y-4 md:gap-x-4 @5xl/main:grid-cols-3">
            {/* Grafik tren harian */}
            <ChartAreaInteractive
              className="col-span-3 "
              chartData={reports.countsByDate}
            />

            {/* Pie chart status produk */}
          

            {/* Pie chart status pesanan */}

              <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Distribusi Siswa  - Status"
              footerDeskripcion="Distribusi siswa berdasarkan status"
              description="Jumlah siswa berdasarkan status"
              data={reports.SiswastatusCount}
              nameKey="Siswa"
            />
            <ChartBarActive
         data={reports.topJurusan.slice(0, 5)} // ambil top 5 saja
         title="5 Jurusan Paling Populer"
       description="Menampilkan 5 jurusan teratas Anda "
  footerText="Data berdasarkan jurusan Anda"
  subFooter="Menampilkan 5 jurusan teratas dengan jumlah siswa"
  
 
/>
            {/* <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Jurusan Distribusi - Status"
              footerDeskripcion="Distribusi pesanan berdasarkan status"
              description="Jumlah pesanan berdasarkan status"
              data={reports.StatusJurusanCount}
              nameKey="Jurusan"
            /> */}

            {/* Pie chart kategori produk */}
            <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Distribusi Kelas - Status"
              footerDeskripcion="Distribusi Kelas berdasarkan status"
              description="Jumlah Kelas berdasarkan status"
              data={reports.KelastatusCount}
              nameKey="Status"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default MainSection;