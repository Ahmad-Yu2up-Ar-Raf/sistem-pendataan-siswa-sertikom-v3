// resources/js/components/siswa/SiswaDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Church, CircleCheckIcon, Users2Icon, VenusAndMars } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
import { selectData, StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/action-bar/status-action-bar";
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateSiswaSheet from "../../sheet/create-sheet/create-siswa-sheet";
import UpdateSiswaSheet from "../../sheet/update-sheet/update-siswa-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";
import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useTableFilters } from "@/hooks/filters/useTableFilters";
import type { pagePropsSiswa } from "@/pages/dashboard/siswa";
import type { SiswaSchema } from "@/lib/validations/app/siswaValidate";
import { cn } from "@/lib/utils";
import { SiswaTable } from "./components/SiswaTable";
import { AgamaOptions } from "@/config/enums/agama";
import { JenisKelaminOptions } from "@/config/enums/jenis-kelamin";
import { StatusSiswaOptions } from "@/config/enums/StatusSiswa";
import { DateRange } from "react-day-picker";

export default function SiswaDataTable({ data }: { data: pagePropsSiswa }) {
  const paginatedData = data.meta.pagination;
  const siswa = data.data.siswa;
  const initialFilters = data.meta.filters;

  // State management
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedId, setDeletedId] = React.useState<number | null>(null);
  const [currentSiswa, setCurrentSiswa] = React.useState<SiswaSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);
 const selectData : selectData[] = [
      {
        Icon: CircleCheckIcon,
        Data : StatusSiswaOptions,
        field: "status"
  
      },
      {
        Icon: Church,
        Data : AgamaOptions,
        field: "agama"
      },
      {
        Icon: VenusAndMars,
        Data :JenisKelaminOptions,
        field: "jenis_kelamin"
      }
    ]
  // Use new useTableFilters hook
  const { 
    filters, 
    setSearch, 
    setEnumFilter, 
    setDateRange,
    clearFilters, 
    hasActiveFilters 
  } = useTableFilters({
    initialFilters,
    route: "/dashboard/siswa",
  });

  // Filter configurations
  const filterConfigs = React.useMemo(
    () => [
     
      {
        column: "jurusan",
        title: "Jurusan",
        type: "relation" as const,
        endpoint: "/dashboard/jurusan/json_data",
        perPage: 10,
      },
      {
        column: "kelas",
        title: "Kelas",
        type: "relation" as const,
        endpoint: "/dashboard/kelas/json_data",
        perPage: 10,
      },
      // {
      //   column: "tahun_ajar",
      //   title: "Tahun Ajar",
      //   type: "relation" as const,
      //   endpoint: "/dashboard/tahun_ajar/json_data",
      //   perPage: 10,
      // },
      {
        column: "created_at",
        title: "Tanggal Dibuat",
        type: "date-range" as const,
      },
    ],
    []
  );

  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (column: string, value: string[] | DateRange | undefined) => {
      if (Array.isArray(value)) {
        setEnumFilter(column, value);
      } else {
        setDateRange(column, value);
      }
    },
    [setEnumFilter, setDateRange]
  );

  // Selection logic
  const allIds: number[] = React.useMemo(
    () => siswa.map((item) => item.id!),
    [siswa]
  );

  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = React.useCallback(() => {
    setSelectedIds(isAllSelected ? [] : [...allIds]);
  }, [isAllSelected, allIds]);

  const handleSelectRow = React.useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }, []);

  // ✅ FIX: Safe edit handler with validation
  const handleEdit = React.useCallback((item: SiswaSchema) => {
    // Validate item has ID before opening
    if (!item.id) {
      console.error("❌ Cannot edit: Siswa ID is missing!", item);
      toast.error("Data siswa tidak valid");
      return;
    }

    console.log("✅ Opening edit for siswa:", item.id, item.nama_lengkap);
    setCurrentSiswa(item);
    setOpenUpdate(true);
  }, []);

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
        setDeletedId(null);
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

  // Bulk actions
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<string | null>(null);
  const [isAnyPending, setIsAnyPending] = React.useState<boolean>(false);

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction("delete");
    setIsAnyPending(true);
    toast.loading("Deleting data...", { id: "siswa-delete" });

    startTransition(() => {
      router.delete(`/dashboard/siswa/${selectedIds}`, {
        data: { ids: selectedIds },
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("Siswa deleted successfully", {
            id: "siswa-delete",
          });
          setSelectedIds([]);
          router.reload();
          setIsAnyPending(false);
          setCurrentAction(null);
        },
        onError: (errors: Record<string, string>) => {
          setCurrentAction(null);
          setIsAnyPending(false);
          console.error("Delete error:", errors);
          toast.error(errors?.message || "Failed to delete siswa", {
            id: "siswa-delete",
          });
        },
      });
    });
  }, [selectedIds]);

  const onTaskUpdate = React.useCallback(
    ({ field, value }: { field: string,  value: string }) => {
      setIsAnyPending(true);
      setCurrentAction(`update-${field}`);

      startTransition(() => {
        const formData = {
          ids: selectedIds,
          value: value,
          colum: field,
        };

        router.post(`/dashboard/siswa/${selectedIds}/status`, formData, {
          preserveScroll: true,
          preserveState: true,
          forceFormData: true,
          onStart: () => {
            toast.loading("Updating siswa data...", { id: "update-toast" });
          },
          onSuccess: () => {
            setCurrentAction(null);
            setIsAnyPending(false);
            toast.success("Siswa updated successfully", {
              id: "update-toast",
            });
          },
          onError: (errors: Record<string, string>) => {
            setCurrentAction(null);
            setIsAnyPending(false);
            console.error("Update error:", errors);
          },
          onFinish: () => {
            setCurrentAction(null);
            setIsAnyPending(false);
          },
        });
      });
    },
    [selectedIds]
  );

  // ✅ FIX: Safe update close handler
  const handleUpdateClose = React.useCallback((open: boolean) => {
    setOpenUpdate(open);
    if (!open) {
      // Delay clearing to allow smooth animation
      setTimeout(() => {
        setCurrentSiswa(null);
      }, 300);
    }
  }, []);

  // Empty state
  if (siswa.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Users2Icon]}
          title="Belum ada data Siswa"
          description="Mulailah dengan menambahkan yang pertama"
          action={{
            label: "Tambahkan Siswa",
            onClick: () => setOpenCreate(true),
          }}
        />
        <CreateSiswaSheet
          trigger={true}
          open={openCreate}
          onOpenChange={() => setOpenCreate(!openCreate)}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn("flex w-full flex-col gap-3.5")}>
        <TableToolbar
          search={filters.search}
          onSearchChange={setSearch}
          filters={filters}
          filterConfigs={filterConfigs}
          onFilterChange={handleFilterChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onCreateClick={() => setOpenCreate(true)}
        />

        <SiswaTable
          data={siswa}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onEdit={handleEdit}
          onDelete={(id) => {
            setOpenDelete(true);
            setDeletedId(id);
          }}
          isAllSelected={isAllSelected}
        />
      </div>

      <Pagination
        pagination={paginatedData}
        filters={initialFilters}
        selectedCount={selectedIds.length}
        totalCount={siswa.length}
        route="/dashboard/siswa"
      />

      {/* Modals/Dialogs */}
      {deletedId && (
        <DeleteDialog
          open={openDelete}
          handledeDelete={handleDelete}
          processing={processing}
          id={deletedId}
          trigger={false}
          onOpenChange={setOpenDelete}
        />
      )}

      {selectedIds.length > 0 && (
        <StatusTableActionBar
        selectProps={selectData}
          onTaskUpdate={onTaskUpdate}
          isPending={isAnyPending}
          setSelected={setSelectedIds}
          onTaskDelete={onTaskDelete}
          table={selectedIds}
        />
      )}

      {/* ✅ FIX: Only render UpdateSiswaSheet if currentSiswa has valid ID */}
      {currentSiswa?.id && (
        <UpdateSiswaSheet
          siswa={currentSiswa}
          open={openUpdate}
          onOpenChange={handleUpdateClose}
        />
      )}

      <CreateSiswaSheet
        trigger
        open={openCreate}
        onOpenChange={() => setOpenCreate(!openCreate)}
      />
    </>
  );
}