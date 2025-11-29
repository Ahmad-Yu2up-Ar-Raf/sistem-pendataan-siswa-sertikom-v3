import JurusanDataTable from '@/components/ui/core/app/actions/table/jurusan/jurusan-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { JurusanSchema } from '@/lib/validations/jurusanValidate'
import { ApiResponse } from '@/types'
import { PencilRuler } from 'lucide-react'

export type  pagePropsJurusan = ApiResponse & {
  data : {
    jurusan : JurusanSchema[] 
  }
}

function index({ ...props} : pagePropsJurusan) {
  return (
<AppLayout  title={"Menagements Jurusan"} icon={PencilRuler}  deskripcion='Ini daftar Jurusan Anda. Kelola Jurusan Anda di sini' >
   



<main  className='   space-y-4'>

<JurusanDataTable data={props}/>
</main>


</AppLayout>
  )
}

export default index