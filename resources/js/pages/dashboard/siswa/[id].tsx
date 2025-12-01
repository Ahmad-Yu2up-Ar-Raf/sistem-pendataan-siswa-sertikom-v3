import AppLayout from '@/components/ui/core/layout/app/app-layout'
import SiswaBlockPage from '@/components/ui/core/layout/app/block/siswaBlockPage';
import { JurusanSchema } from '@/lib/validations/app/jurusanValidate';
import { KelasDetailSchema } from '@/lib/validations/app/kelasDetailValidate';
import { KelasSchema } from '@/lib/validations/app/kelasValidate';
import { SiswaSchema } from '@/lib/validations/app/siswaValidate'
import { TahunAjarSchema } from '@/lib/validations/app/tahunAjarValidate';
import { ApiResponse } from '@/types';
 

export type pagePropsSiswa = ApiResponse & {
  
  data: {
   siswa : SiswaSchema & {
      jurusan?: JurusanSchema,
      kelas?: KelasSchema,
      tahun_masuk?: TahunAjarSchema,
     
    };



    kelas_detail : KelasDetailSchema[] 
  }
}

function  pages({ ...props} : pagePropsSiswa) {
    console.log(props.data.kelas_detail)
  return (
 <AppLayout    >
   
    



<SiswaBlockPage pageProps={props}  />
 


</AppLayout>
  )
}

export default pages