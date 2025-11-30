

import KelasDataTable from '@/components/ui/core/app/actions/table/kelas/kelas-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { KelasSchema } from '@/lib/validations/app/kelasValidate'
import { ApiResponse } from '@/types'
import { DoorOpen } from 'lucide-react'


export type  pagePropsKelas = ApiResponse & {
  data : {
    kelas : KelasSchema[] 
  }
}

function index({ ...props} : pagePropsKelas) {
 
  return (
   <AppLayout  title={"Menagements Kelas"} icon={DoorOpen}  deskripcion='Ini daftar Kelas Anda. Kelola Kelas Anda di sini'>
      
  
<main  className='   space-y-4'>

<KelasDataTable data={props}/>
</main>

   </AppLayout>
  )
}

export default index