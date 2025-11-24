import CreateJurusanSheet from '@/components/ui/core/app/actions/sheet/create-sheet/create-jurusan-sheet'
import AppLayout from '@/components/ui/core/layout/app/app-layout'


function index() {
  return (
<AppLayout >
   
    <div className="flex-1 space-y-4">

<header className="flex flex-col gap-0.5 mb-6">
<h2 className=" text-3xl font-bold tracking-tighter ">Menagements Jurusan</h2>
<p className="text-muted-foreground ">Ini daftar Jurusan Anda. Kelola Jurusan Anda di sini.</p>
</header>


<main  className='   space-y-4'>
<CreateJurusanSheet/>
</main>
</div>
</AppLayout>
  )
}

export default index