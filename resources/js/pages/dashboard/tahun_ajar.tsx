import CreateTahunAjarSheet from '@/components/ui/core/app/actions/sheet/create-sheet/create-tahun-ajar-sheet'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { Head } from '@inertiajs/react'

function index() {
  return (
    <AppLayout >
   
    <div className="flex-1 space-y-4">

<header className="flex flex-col gap-0.5 mb-6">
<h2 className=" text-3xl font-bold tracking-tighter ">Menagements Tahun Ajar</h2>
<p className="text-muted-foreground ">Ini daftar Tahun Ajar Anda. Kelola Tahun Ajar Anda di sini.</p>
</header>


<main  className='   space-y-4'>
<CreateTahunAjarSheet/>
{/* <OrderDataTable  data={props}/> */}
</main>
</div>
</AppLayout>
  )
}

export default index