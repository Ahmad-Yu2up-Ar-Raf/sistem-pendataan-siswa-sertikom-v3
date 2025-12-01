

"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
 
import {   History, Plus } from "lucide-react"
import { Card, CardContent, CardDescription,   CardHeader, CardTitle } from "@/components/ui/fragments/shadcn-ui/card"
 
 
import { SiswaSchema } from "@/lib/validations/app/siswaValidate"
 
import { KelasDetailSchema } from "@/lib/validations/app/kelasDetailValidate"
import { EmptyState } from "../empty-state"
 
import { Button } from "../../shadcn-ui/button"
import TimelineCard from "../time-line"
import { RowActions } from "../table/RowActions"
import { JurusanSchema } from "@/lib/validations/app/jurusanValidate"
import { KelasSchema } from "@/lib/validations/app/kelasValidate"
import { TahunAjarSchema } from "@/lib/validations/app/tahunAjarValidate"








interface DetailCardProps {
  title?: string
  className?: string
  description?: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>> 
  Siswa :  SiswaSchema & {
        jurusan?: JurusanSchema,
        kelas?: KelasSchema,
        tahun_masuk?: TahunAjarSchema,
       
      };
    
   onEdit: (item: KelasDetailSchema) => void;
  onDelete: (id: number) => void;
      kelas_details?: KelasDetailSchema[]
  
}
 
export default function RiwayatCard({
  title = "Riwayat Kelas",
  className,
  description = "Menampilkan riwayat kelas siswa secara detail",
  Siswa,
  onDelete,
  onEdit,
 setOpen,
    ...props
}: DetailCardProps) {
 

 
    const dataRiwayat = props.kelas_details
  return (
   <Card className={cn("flex flex-col w-full gap-2 ",    className)}>
       <CardHeader className=" space-y-0 border-b [.border-b]:pb-5   ">
        <div className="flex items-start gap-8 justify-between">
          <div className="flex-1">
            <CardTitle className=" gap-2">

              {`${title}  `}
            </CardTitle>
            <CardDescription className="mt-2 text-xs">{description}</CardDescription>
          </div>
          {dataRiwayat?.length! > 0 && (
            <Button    size={"sm"} className="w-fit text-sm" onClick={() => setOpen(true)}>
            <Plus className=" size-3 " />
           <span className="  hidden">
            Tambahkan Baru
            </span> 
          </Button> 

          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 pt-3 content-center">
        {dataRiwayat && dataRiwayat?.length > 0  ? (

            <TimelineCard siswa={Siswa} onDelete={onDelete}  onEdit={onEdit} History={dataRiwayat}/>


        )
        
        
        : 


          <EmptyState  icons={[History]}
                    title="Tidak ada riwayat"
                    description="Siswa tidak memiliki riwayat"
                    action={{
                      label: "Tambahkan Riwayat",
                      onClick: () => setOpen(true),
                    }} 
                    
                    />
                  }
      
      </CardContent>
       
    </Card>
  )


}

 
