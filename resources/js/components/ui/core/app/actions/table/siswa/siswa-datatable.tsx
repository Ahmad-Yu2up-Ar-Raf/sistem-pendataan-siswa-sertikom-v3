// resources/js/components/siswa/SiswaDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
import { StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/siswa-action-bar";
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateSiswaSheet from "../../sheet/create-sheet/create-siswa-sheet";
import UpdateSiswaSheet from "../../sheet/update-sheet/update-siswa-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";

import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useFilters } from "@/hooks/filters/useFilters";
import type { pagePropsSiswa } from "@/pages/dashboard/siswa";
import type { SiswaSchema } from "@/lib/validations/siswaValidate";
import { StatusOptions } from "@/config/enums/status";
import { cn } from "@/lib/utils";
import { SiswaTable } from "./components/SiswaTable";
import { AgamaOptions } from "@/config/enums/agama";
import { JenisKelaminOptions } from "@/config/enums/jenis-kelamin";
import { StatusSiswaOptions } from "@/config/enums/StatusSiswa";

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
  const [currentSiswa, setCurrentSiswa] =
    React.useState<SiswaSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);

  // Filter hook
  const { filters, setSearch, setEnumFilter, clearFilters, hasActiveFilters } =
    useFilters({
      initialFilters,
      route: "/dashboard/siswa",
    });

  // Filter configurations (reusable for multiple enum columns)
  const filterConfigs = React.useMemo(
    () => [
      {
        column: "agama",
        title: "agama",
        options: AgamaOptions,
      },
      {
        column: "status",
        title: "Status",
        options: StatusSiswaOptions,
      },
      {
        column: "jenis_kelamin",
        title: "Gender",
        options: JenisKelaminOptions,
      },
     
    
      // Add more filter configs here for other enum columns:
      // { column: "semester", title: "Semester", options: SemesterOptions },
    ],
    []
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

  // CRUD operations
  const handleEdit = React.useCallback((item: SiswaSchema) => {
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


  const actions = [
    "update-status",
    "update-visiblity",
    "delete",
  ] as const;
    type Action = (typeof actions)[number];
  const onTaskUpdate = React.useCallback(
    ({ field, value }: { field:  "status"  | "agama" | "jenis_kelamin"; value: string }) => {
      setIsAnyPending(true);
    
      setCurrentAction("update-status");

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

  const handleUpdateClose = React.useCallback((open: boolean) => {
    setOpenUpdate(open);
    if (!open) {
      setTimeout(() => {
        setCurrentSiswa(null);
      }, 500);
    }
  }, []);

  // Empty state
  if (siswa.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Calendar]}
          title="No Siswa data yet"
          description="Start by adding your first siswa"
          action={{
            label: "Add Siswa",
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
        {/* Toolbar with search, filters, and create button */}
        <TableToolbar
          search={filters.search}
          onSearchChange={setSearch}
          filters={filters}
          filterConfigs={filterConfigs}
          onFilterChange={setEnumFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onCreateClick={() => setOpenCreate(true)}
        />

        {/* Table */}
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

      {/* Pagination */}
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
          onTaskUpdate={onTaskUpdate}
          isPending={isAnyPending}
          setSelected={setSelectedIds}
          onTaskDelete={onTaskDelete}
          table={selectedIds}
        />
      )}

      {currentSiswa && (
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