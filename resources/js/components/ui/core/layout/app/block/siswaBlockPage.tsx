 import { pagePropsSiswa } from '@/pages/dashboard/siswa/[id]'

import { useInitials } from '@/hooks/use-initials';
import SiswaDetailHeader from './fragments/siswaDetailHeader';

import DetailCard from '@/components/ui/fragments/custom-ui/card/detail-card';

 function SiswaBlockPage({  ...props}: pagePropsSiswa ) {
    const siswa = props.data
      const getInitial = useInitials()
   return (
    <main className=' space-y-7'>
    <SiswaDetailHeader data={props.data} status={props.status}/>
    <DetailCard dataSiswa={siswa}/>
    </main>
   )
 }

 export default SiswaBlockPage
