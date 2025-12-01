 import { pagePropsSiswa } from '@/pages/dashboard/siswa/[id]'

import { useInitials } from '@/hooks/use-initials';
import SiswaDetailHeader from './fragments/siswaDetailHeader';
 
 function SiswaBlockPage({  ...props}: pagePropsSiswa ) {
    const siswa = props
      const getInitial = useInitials()
   return (
    <>
    <SiswaDetailHeader data={props.data} status={props.status}/>
    </>
   )
 }
 
 export default SiswaBlockPage
 