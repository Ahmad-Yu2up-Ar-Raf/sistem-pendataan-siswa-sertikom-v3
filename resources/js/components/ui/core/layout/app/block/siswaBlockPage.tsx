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
import { KelasDetailSchema } from '@/lib/validations/app/kelasDetailValidate';
import UpdateKelasDetailSheet from '../../../app/actions/sheet/update-sheet/update-kelas-detail-sheet';

 function SiswaBlockPage({ pageProps}: { pageProps : pagePropsSiswa} ) {
    const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
   const [currentHistory, setCurrentHistory] = React.useState<KelasDetailSchema | null>(null);
    const [openUpdateHistory, setOpenUpdateUpdateHistory] = React.useState(false);
    const [openDeleteHistory, setOpenDeleteHistory] = React.useState(false);
    const [deletedId, setDeletedId] = React.useState<number | null>(null);
    const [openDelete, setOpenDelete] = React.useState(false);
     const [processing, setProcessing] = React.useState(false);
       // ✅ FIX: Safe edit handler with validation
       const handleEdit = React.useCallback((item: KelasDetailSchema) => {
         setCurrentHistory(item);
         setOpenUpdateUpdateHistory(true);
       }, []);
       
 const handleUpdateClose = React.useCallback((open: boolean) => {
    setOpenUpdateUpdateHistory(open);
    if (!open) {
 
      setTimeout(() => {
        setCurrentHistory(null);
      }, 300);
    }
  }, []);
  const handleDeleteHistory = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting History...", { id: "history-delete" });

    router.delete(`/dashboard/kelasDetail/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("History deleted successfully", {
          id: "history-delete",
        });
        setOpenDelete(false);
        setDeletedId(null);
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the history", {
          id: "history-delete",
        });
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  }, []);


    const siswa = pageProps.data.siswa
      const getInitial = useInitials()
  //       const handleDelete = React.useCallback((taskId: number) => {
  //   setProcessing(true);
  //   toast.loading("Deleting Siswa...", { id: "siswa-delete" });

  //   router.delete(`/dashboard/siswa/destroy`, {
  //     data: { ids: [taskId] },
  //     preserveScroll: true,
  //     preserveState: true,
  //     onSuccess: () => {
  //       toast.success("Siswa deleted successfully", {
  //         id: "siswa-delete",
  //       });
  //       setOpenDelete(false);
     
  //       router.reload();
  //     },
  //     onError: (errors: Record<string, string>) => {
  //       console.error("Delete error:", errors);
  //       toast.error(errors?.message || "Failed to delete the siswa", {
  //         id: "siswa-delete",
  //       });
  //     },
  //     onFinish: () => {
  //       setProcessing(false);
  //     },
  //   });
  // }, []);
   return (
    <>
    <main className=' space-y-6'>
    <SiswaDetailHeader 
    
         onEdit={() => setOpenUpdate(true)}
          onDelete={() => {
            setOpenDelete(true); 
          }}
    data={pageProps.data.siswa}  />
   

          <div className=" grid md:grid-cols-2   gap-6">


    <DetailCard dataSiswa={siswa}/>
    <RiwayatCard   onEdit={handleEdit}
          onDelete={(id) => {
            setOpenDeleteHistory(true);
            setDeletedId(id);
          }} Siswa={siswa} setOpen={setOpenCreate} kelas_details={pageProps.data.kelas_detail}      />
          </div>
    </main>

    {currentHistory?.id && (
          <UpdateKelasDetailSheet
            kelasDetail={currentHistory}
            open={openUpdateHistory}
            onOpenChange={handleUpdateClose}
          />
        )}
             <CreateKelasDetailSheet
             siswa={siswa}
                    trigger={true}
                    open={openCreate}
                    onOpenChange={() => setOpenCreate(!openCreate)}
                  />
                     {deletedId && (
            <DeleteDialog
              open={openDeleteHistory}
              handledeDelete={handleDeleteHistory}
              processing={processing}
              id={deletedId}
              trigger={false}
              onOpenChange={setOpenDeleteHistory}
            />
                     )}
             <UpdateSiswaSheet
               siswa={siswa}
               open={openUpdate}
               onOpenChange={setOpenUpdate}
             />
       
    </>
   )
 }

 export default SiswaBlockPage
