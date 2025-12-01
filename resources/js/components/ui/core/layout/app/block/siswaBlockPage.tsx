 import { pagePropsSiswa } from '@/pages/dashboard/siswa/[id]'

import { useInitials } from '@/hooks/use-initials';
import SiswaDetailHeader from './fragments/siswaDetailHeader';

import DetailCard from '@/components/ui/fragments/custom-ui/card/detail-card';
import React from 'react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import DeleteDialog from '@/components/ui/fragments/custom-ui/dialog/DeleteDialog';
import UpdateSiswaSheet from '../../../app/actions/sheet/update-sheet/update-siswa-sheet';
import RiwayatCard from '@/components/ui/fragments/custom-ui/card/history-card';
import CreateKelasDetailSheet from '../../../app/actions/sheet/create-sheet/create-kelas-detail-sheet';

 function SiswaBlockPage({ pageProps}: { pageProps : pagePropsSiswa} ) {
    const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
     const [processing, setProcessing] = React.useState(false);
    const siswa = pageProps.data.siswa
      const getInitial = useInitials()
        const handleDelete = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting Siswa...", { id: "siswa-delete" });

    router.delete(`/dashboard/siswa/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Siswa deleted successfully", {
          id: "siswa-delete",
        });
        setOpenDelete(false);
     
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the siswa", {
          id: "siswa-delete",
        });
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  }, []);
   return (
    <>
    <main className=' space-y-6'>
    {/* <SiswaDetailHeader 
    
         onEdit={() => setOpenUpdate(true)}
          onDelete={() => {
            setOpenDelete(true); 
          }}
    data={pageProps.data.siswa}  /> */}
   

    {/* <DetailCard dataSiswa={siswa}/> */}
    <RiwayatCard  Siswa={siswa} setOpen={setOpenCreate} kelas_details={pageProps.data.kelas_detail}      />
 
    </main>
             <CreateKelasDetailSheet
             siswa={siswa}
                    trigger={true}
                    open={openCreate}
                    onOpenChange={() => setOpenCreate(!openCreate)}
                  />
            <DeleteDialog
              open={openDelete}
              handledeDelete={handleDelete}
              processing={processing}
              id={siswa.id!}
              trigger={false}
              onOpenChange={setOpenDelete}
            />
        
             <UpdateSiswaSheet
               siswa={siswa}
               open={openUpdate}
               onOpenChange={setOpenUpdate}
             />
       
    </>
   )
 }

 export default SiswaBlockPage
