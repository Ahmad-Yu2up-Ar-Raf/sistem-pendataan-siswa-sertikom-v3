
import SiswaDataTable from '@/components/ui/core/app/actions/table/siswa/siswa-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { SiswaSchema } from '@/lib/validations/app/siswaValidate'

import { ApiResponse } from '@/types'
import {GraduationCap, Users2Icon } from 'lucide-react'


export type  pagePropsSiswa = ApiResponse & {
  data : {
    siswa : SiswaSchema[] 
  }
}

function index({ ...props} : pagePropsSiswa) {
    
 
  return (
    <AppLayout title={"Menagements Siswa"} icon={GraduationCap}  deskripcion='Ini daftar siswa Anda. Kelola siswa Anda di sini'>
   
    




<main  className='   space-y-4'>

<SiswaDataTable data={props}/>
</main>


</AppLayout>
  )
}

export default index