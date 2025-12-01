import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { pagePropsSiswa } from '@/pages/dashboard/siswa/[id]';
import { useInitials } from '@/hooks/use-initials';
import {   getStatusSiswaBadgeColor, } from "@/lib/utils/index";
 
import { cn } from "@/lib/utils";
import { StatusSiswa } from "@/config/enums/StatusSiswa";
import { batasiKata } from "@/hooks/useWord";
import { RowActions } from "@/components/ui/fragments/custom-ui/table/RowActions";
import { SiswaSchema } from "@/lib/validations/app/siswaValidate";
import { KelasSchema } from "@/lib/validations/app/kelasValidate";
import { JurusanSchema } from "@/lib/validations/app/jurusanValidate";
import { TahunAjarSchema } from "@/lib/validations/app/tahunAjarValidate";
 function SiswaDetailHeader({  onDelete, data,  onEdit}: {
  data : SiswaSchema & {
        jurusan?: JurusanSchema,
        kelas?: KelasSchema,
        tahun_masuk?: TahunAjarSchema,
 
      };
  
    onEdit: () => void;
  onDelete: () => void;
 } )  {
          const getInitial = useInitials()
            const batasiHurufNama = batasiKata(data.nama_lengkap, 2)
          const status  = data.status as StatusSiswa
          const statusColor = getStatusSiswaBadgeColor(status)
   return (
       <header className='  flex w-full justify-between  items-center  pb-6      border-b border-border '>
          <div className="flex-row  text-left  flex gap-4 content-center items-center">

      <div className="relative">

       <Avatar className="  rounded-full  relative flex size-18 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${data?.foto!}`} alt={data.nama_lengkap} />
                                          <AvatarFallback className={cn("rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white",


                                          )}>
                                              {getInitial(data.nama_lengkap)}
                                          </AvatarFallback>
                                      </Avatar>
                                      <span className={cn("-end-0.5 sr-only -bottom-0.5 absolute size-4.5 rounded-xl border-3 border-background " ,
                                                            statusColor
                                      )}>
        <span className="sr-only">Online</span>
      </span>
      </div>

<div className="  m-auto w-full   flex flex-col   ">

<h1 className=" text-xl   m-auto w-full   font-semibold      tracking-tighter ">

  {batasiHurufNama}
  </h1>
<p className="text-muted-foreground  ">


    {data.kelas?.nama_kelas}</p>
</div>
          </div>
          <RowActions onDelete={onDelete} onEdit={onEdit}/>
</header>
   )
 }

 export default SiswaDetailHeader
