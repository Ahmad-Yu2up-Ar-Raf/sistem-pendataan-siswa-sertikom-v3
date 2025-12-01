

"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge"
import { Calendar, MapPin, Clock, CheckCircle,  DoorOpen, UsersRound, Venus, Mars, VenusAndMars, Building2, XCircle, CircleX, UserCheck2, UserRoundX } from "lucide-react"
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

}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'available':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'full':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'limited':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'mixture':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'male':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'female':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
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
  <div className={cn("flex items-start gap-3 py-3 border-b border-border/50 last:border-b-0", className)}>
    <Icon className="h-4 sr-only w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
    <div className="flex justify-between w-full min-w-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground mt-1">{value}</div>
    </div>
  </div>
)

function DetailCard({
  title = "General Information",
  className,
  description = "Showing detailed siswa information and current status",

  dataSiswa ,

}: DetailCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }




  const status = dataSiswa.status as StatusSiswa;
  const agama = dataSiswa.agama as Agama;
  const jenis_kelamin = dataSiswa.jenis_kelamin as JenisKelamin;
  const IconStatus = getStatusSiswaIcon(status);
  const IconStatusColor = getStatusSiswaBadgeColor(status);
  const IconAgamaColor = getAgamaBadgeColor(agama);
  const IconAgama = getAgamaIcon(agama);
  const IconGender = getJenisKelaminIcon(jenis_kelamin);
  const getInitial = useInitials()
  const batasiHurufNama = batasiKata(dataSiswa.nama_lengkap, 2)
  return (
   <Card className={cn("flex flex-col w-full gap-2 ",    className)}>
       <CardHeader className=" space-y-0 border-b [.border-b]:pb-5   ">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className=" gap-2">

              {`${title} #${dataSiswa.id}`}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-1 content-center">
        <InfoItem
          icon={Building2}
          label="Siswa Name"
          value={<span className="font-medium">{dataSiswa.nama_lengkap}</span>}
        />
        {dataSiswa.alamat && (

        <InfoItem
          icon={MapPin}
          label="Location"
          value={dataSiswa.alamat || "Location not specified"}
        />
        )}

        <InfoItem
          icon={DoorOpen}
          label="Room Capacity"
          value={
            <div className="flex items-center gap-2">
              <span className="font-medium">Kelas {dataSiswa.kelas?.nama_kelas} </span>
            </div>
          }
        />



  <>
   <InfoItem
          icon={DoorOpen}
          label="Status"
          value={
           <Badge  className={cn("py-1 [&>svg]:size-3.5", IconStatusColor)} >
                <IconStatus className=" mr-1" />

              {dataSiswa.status}
            </Badge>
          }
        />

   <InfoItem
          icon={DoorOpen}
          label="Agama"
          value={
          <Badge  className={cn("py-1 [&>svg]:size-3.5",IconAgamaColor)} >
         <IconAgama className=" mr-1" />

              {dataSiswa.agama}
            </Badge>
          }
        />

  </>




        {/* {dataSiswa.capacityEmploye ? (

        <InfoItem
          icon={UsersRound}
          label="Employee Capacity"
          value={   <div className="flex items-center gap-2">
              <span className="font-medium">{dataSiswa.capacityEmploye} Employe</span>
            </div> }
        />
        ) : null}

        <InfoItem
          icon={dataSiswa.type == "female" ? Venus  : dataSiswa.type == "male" ? Mars : VenusAndMars }
          label="Siswa Type"
          value={
            <Badge className={getTypeColor(dataSiswa.type)}>
              {dataSiswa.type}
            </Badge>
          }
        />

        <InfoItem
          icon={Calendar}
          label="Created At"
          value={formatDate(dataSiswa.createdAt)}
        />




        {dataSiswa.deskripcion && (
          <InfoItem
            icon={Clock}
            label="Description"
            value={<p className="text-sm leading-relaxed">{dataSiswa.deskripcion}</p>}
          />
        )} */}
      </CardContent>
            {/* <CardFooter className=" pt-4 border-t sr-only">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className={cn("w-2 h-2 rounded-full mr-2",
                dataSiswa.status === 'active' ? 'bg-green-500' :  'bg-red-500'
              )} />
              Status: {dataSiswa.status}
            </div>
            <div className="flex items-center">
              <div className={cn("w-2 h-2 rounded-full mr-2",
                dataSiswa.statusCapacity === 'available' ? 'bg-blue-500' :
                dataSiswa.statusCapacity === 'full' ? 'bg-red-500' : 'bg-orange-500'
              )} />
              Capacity: {dataSiswa.statusCapacity}
            </div>
          </div>
        </CardFooter> */}
    </Card>
  )


}

export default DetailCard
