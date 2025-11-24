import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { Head } from '@inertiajs/react'
import React from 'react'

function index() {
  return (
    <AppLayout >
    <Head title="Dashboard" />
    <div className="flex-1 space-y-4">

<header className="flex flex-col gap-0.5 mb-6">
<h2 className="text-3xl font-bold tracking-tight ">Menagements Siswa</h2>
<p className="text-muted-foreground">Here is your pinjaman list. Manage your Orders here.</p>
</header>


{/* <main  className='   space-y-4'>

<OrderDataTable  data={props}/>
</main> */}
</div>
</AppLayout>
  )
}

export default index