import AppLayout from '@/components/ui/core/layout/app/app-layout'
import SiswaBlockPage from '@/components/ui/core/layout/app/block/siswaBlockPage';
import { JurusanSchema } from '@/lib/validations/app/jurusanValidate';
import { KelasSchema } from '@/lib/validations/app/kelasValidate';
import { SiswaSchema } from '@/lib/validations/app/siswaValidate'
import { TahunAjarSchema } from '@/lib/validations/app/tahunAjarValidate';
 

export type pagePropsSiswa = {
  status: boolean
  data: SiswaSchema & {
      jurusan?: JurusanSchema,
      kelas?: KelasSchema,
      tahun_masuk?: TahunAjarSchema
    };
}

function  pages({ data  , status} : pagePropsSiswa) {
 
  return (
 <AppLayout    >
   
    



<SiswaBlockPage data={data} status={status}/>
 


</AppLayout>
  )
}

export default pages