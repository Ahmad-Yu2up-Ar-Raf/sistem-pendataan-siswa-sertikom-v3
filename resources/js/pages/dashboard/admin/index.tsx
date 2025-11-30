 
import UserDataTable from '@/components/ui/core/app/actions/table/user/User-datatable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { UserSchema } from '@/lib/validations/auth/auth'
 

import { ApiResponse } from '@/types'
import {Key, Users2Icon } from 'lucide-react'


export type  pagePropsAdmin = ApiResponse & {
  data : {
    users : UserSchema[] 
  }
}

function index({ ...props } : pagePropsAdmin) {
    
  console.log(props );
  return (
    <AppLayout title={"Menagements Admin"} icon={Key}  deskripcion='Ini daftar user Anda. Kelola user Anda di sini'>
   
    




<main  className='   space-y-4'>

<UserDataTable data={props}/>
</main>


</AppLayout>
  )
}

export default index