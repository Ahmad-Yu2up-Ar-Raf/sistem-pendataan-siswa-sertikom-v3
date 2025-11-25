import CreateSiswaSheet from '@/components/ui/core/app/actions/sheet/create-sheet/create-siswa-sheet'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { SiswaSchema } from '@/lib/validations/siswaValidate'
import { TahunAjarSchema } from '@/lib/validations/tahunAjarValidate'
import { ApiResponse } from '@/types'
import { Head, usePage } from '@inertiajs/react'



function index({ ...props} : ApiResponse & {
  data : {
    siswa : SiswaSchema[]
    
  }
}) {
    
 
  return (
    <AppLayout >
    <Head title="Dashboard" />
    <div className="flex-1 space-y-4">

<header className="flex flex-col gap-0.5 mb-6">
<h2 className="text-3xl font-bold tracking-tight ">Menagements Siswa</h2>
<p className="text-muted-foreground">Here is your pinjaman list. Manage your Orders here.</p>
</header>


<main  className='   space-y-4'>
<CreateSiswaSheet/>
{/* <OrderDataTable  data={props}/> */}
</main>
</div>
</AppLayout>
  )
}

export default index