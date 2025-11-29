import CreateTahunAjarSheet from '@/components/ui/core/app/actions/sheet/create-sheet/create-tahun-ajar-sheet'
import  TahunAjarDataTable  from '@/components/ui/core/app/actions/table/tahun_ajar/tahun-ajar-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { TahunAjarSchema } from '@/lib/validations/tahunAjarValidate'
import { ApiResponse } from '@/types'
import { Calendar } from 'lucide-react'


export type  pagePropsTahunAjar = ApiResponse & {
  data : {
    tahunAjar : TahunAjarSchema[] 
  }
}

function index({ ...props} : pagePropsTahunAjar) {


  console.log(props.data.tahunAjar)
  return (
    <AppLayout title={"Menagements Tahun Ajar"}  deskripcion='Ini daftar Tahun Ajar Anda. Kelola Tahun Ajar Anda di sini' icon={Calendar}>
   




<main  className='   space-y-4'>

<TahunAjarDataTable data={props}/>
</main>

</AppLayout>
  )
}

export default index