

"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge"
import { Calendar, MapPin, Clock, CheckCircle,  DoorOpen, UsersRound, Venus, Mars, VenusAndMars, Building2, XCircle, CircleX, UserCheck2, UserRoundX, PencilRuler, User, UserRound, IdCard, PenIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/fragments/shadcn-ui/card"
import { SiswaSchema } from "@/lib/validations/app/siswaValidate"
import { JurusanSchema } from "@/lib/validations/app/jurusanValidate"
import { KelasSchema } from "@/lib/validations/app/kelasValidate"
import { TahunAjarSchema } from "@/lib/validations/app/tahunAjarValidate"
import { StatusSiswa } from "@/config/enums/StatusSiswa"
import { Agama } from "@/config/enums/agama"
import { JenisKelamin } from "@/config/enums/jenis-kelamin"
import { getAgamaBadgeColor, getAgamaIcon, getJenisKelaminIcon, getStatusIcon, getStatusSiswaBadgeColor, getStatusSiswaIcon } from "@/lib/utils/index"
import { useInitials } from "@/hooks/use-initials"
import { batasiKata } from "@/hooks/useWord"
import { Button } from "../../shadcn-ui/button"


interface DetailCardProps {
  title?: string
  className?: string
  description?: string
  variant?: "default" | "outline" | "ghost" | "gradient"
  dataSiswa:  SiswaSchema & {
      jurusan?: JurusanSchema,
      kelas?: KelasSchema,
      tahun_masuk?: TahunAjarSchema
    };
  onCreateClick?: () => void;
}


const InfoItem = ({
  icon: Icon,
  label,
  value,
  
  className
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  className?: string
}) => (
  <div className={cn(" flex w-full justify-between py-3 border-b border-border/50 last:border-b-0", className)}>
    <div className="flex content-center items-start gap-3 ">

    <Icon className="size-4 text-muted-foreground   sr-only flex-shrink-0" />
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
 
      <p className="text-xs text-right text-foreground mt-1">{value}</p>
 
  </div>
)

function DetailCard({
  title = "Informasi Umum",
  className,
  description = "Menampilkan informasi siswa secara detail",
    onCreateClick,
  dataSiswa ,

}: DetailCardProps) {
 


  const status = dataSiswa.status as StatusSiswa;
  const agama = dataSiswa.agama as Agama;
  const jenis_kelamin = dataSiswa.jenis_kelamin as JenisKelamin;
 
  const IconStatus= getStatusSiswaIcon(status);
 
  const IconAgama = getAgamaIcon(agama);
  const IconGender = getJenisKelaminIcon(jenis_kelamin);
 
  return (
   <Card className={cn("flex flex-col w-full gap-2 ",    className)}>
       <CardHeader className=" space-y-0 border-b [.border-b]:pb-5   ">
        <div className=' flex-row      flex gap-5 content-center items-center '>
          
          <div className="  m-auto w-full items-center content-center md:gap-2 ">
            <CardTitle className=" gap-2 ">

              {`${title}  `}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          {/* <Button onClick={onCreateClick} variant="outline" size="icon"   className="  ">
        <PenIcon />
        </Button> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 content-center">
        <InfoItem
          icon={UserRound}
          label="Nama "
          value={<span className="font-medium">{dataSiswa.nama_lengkap}</span>}
        />
        <InfoItem
          icon={IdCard}
          label="NISN"
          value={<span className="font-medium">{dataSiswa.nisn}</span>}
        />
       

        <InfoItem
          icon={DoorOpen}
          label="Kelas"
          value={
            <div className="flex items-center gap-2">
              <span className="font-medium"> 
                  <Badge  variant={"outline"} className={cn("py-1 [&>svg]:size-3.5")} >
         <DoorOpen className=" mr-1" />

              {dataSiswa.kelas?.nama_kelas}
            </Badge> </span>
            </div>
          }
        />
        <InfoItem
          icon={PencilRuler}
          label="Jurusan"
          value={
            <div className="flex items-center gap-2">
              <span className="font-medium"> 
                  <Badge  variant={"outline"} className={cn("py-1 [&>svg]:size-3.5")} >
         <PencilRuler className=" mr-1" />

              {dataSiswa.jurusan?.nama_jurusan}
            </Badge> </span>
            </div>
          }
        />



  <>
 

   <InfoItem
          icon={DoorOpen}
          label="Agama"
          value={
          <Badge  variant={"outline"} className={cn("py-1 [&>svg]:size-3.5")} >
         <IconAgama className=" mr-1" />

              {dataSiswa.agama}
            </Badge>
          }
        />
   <InfoItem
          icon={VenusAndMars}
          label="Kelamin"
          value={
          <Badge  variant={"outline"} className={cn("py-1 [&>svg]:size-3.5")} >
         <IconGender className=" mr-1" />

              {dataSiswa.jenis_kelamin}
            </Badge>
          }
        />
   <InfoItem
          icon={IconStatus}
          label="Status"
          value={
          <Badge  variant={"outline"} className={cn("py-1 [&>svg]:size-3.5")} >
         <IconStatus className=" mr-1" />

              {dataSiswa.status}
            </Badge>
          }
        />

  </>




       
      </CardContent>
          
    </Card>
  )


}

export default DetailCard
