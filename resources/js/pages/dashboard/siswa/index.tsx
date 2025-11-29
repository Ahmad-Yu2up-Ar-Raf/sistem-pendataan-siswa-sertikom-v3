
import SiswaDataTable from '@/components/ui/core/app/actions/table/siswa/siswa-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { SiswaSchema } from '@/lib/validations/siswaValidate'

import { ApiResponse } from '@/types'
import {Users2Icon } from 'lucide-react'


export type  pagePropsSiswa = ApiResponse & {
  data : {
    siswa : SiswaSchema[] 
  }
}

function index({ ...props} : pagePropsSiswa) {
    
console.log(props.data.siswa)
  return (
    <AppLayout title={"Menagements Siswa"} icon={Users2Icon}  deskripcion='Here is your pinjaman list. Manage your Orders here'>
   
    




<main  className='   space-y-4'>

<SiswaDataTable data={props}/>
</main>


</AppLayout>
  )
}

export default index