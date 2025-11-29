// resources/js/components/kelas/KelasDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
import { StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/status-action-bar";
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateKelasSheet from "../../sheet/create-sheet/create-kelas-sheet";
import UpdateKelasSheet from "../../sheet/update-sheet/update-kelas-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";
import { KelasTable } from "./components/KelasTable";
import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useFilters } from "@/hooks/filters/useFilters";
import type { pagePropsKelas } from "@/pages/dashboard/kelas/index";
import type { KelasSchema } from "@/lib/validations/kelasValidate";
import { StatusOptions } from "@/config/enums/status";
import { cn } from "@/lib/utils";

export default function KelasDataTable({ data }: { data: pagePropsKelas }) {
  const paginatedData = data.meta.pagination;
  const kelas = data.data.kelas;
  const initialFilters = data.meta.filters;

  // State management
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedId, setDeletedId] = React.useState<number | null>(null);
  const [currentKelas, setCurrentKelas] =
    React.useState<KelasSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);

  // Filter hook
  const { filters, setSearch, setEnumFilter, clearFilters, hasActiveFilters } =
    useFilters({
      initialFilters,
      route: "/dashboard/kelas",
    });

  // Filter configurations (reusable for multiple enum columns)
  const filterConfigs = React.useMemo(
    () => [
      {
        column: "status",
        title: "Status",
        options: StatusOptions,
      },
    ],
    []
  );

  // Selection logic
  const allIds: number[] = React.useMemo(
    () => kelas.map((item) => item.id!),
    [kelas]
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
  const handleEdit = React.useCallback((item: KelasSchema) => {
    setCurrentKelas(item);
    setOpenUpdate(true);
  }, []);

  const handleDelete = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting Kelas...", { id: "kelas-delete" });

    router.delete(`/dashboard/kelas/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Kelas deleted successfully", {
          id: "kelas-delete",
        });
        setOpenDelete(false);
        setDeletedId(null);
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the kelas", {
          id: "kelas-delete",
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
    toast.loading("Deleting data...", { id: "kelas-delete" });

    startTransition(() => {
      router.delete(`/dashboard/kelas/${selectedIds}`, {
        data: { ids: selectedIds },
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("Kelas deleted successfully", {
            id: "kelas-delete",
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
          toast.error(errors?.message || "Failed to delete kelas", {
            id: "kelas-delete",
          });
        },
      });
    });
  }, [selectedIds]);

  const onTaskUpdate = React.useCallback(
    ({ field, value }: { field: "status"; value: string }) => {
      setIsAnyPending(true);
      setCurrentAction("update-status");

      startTransition(() => {
        const formData = {
          ids: selectedIds,
          value: value,
          colum: field,
        };

        router.post(`/dashboard/kelas/${selectedIds}/status`, formData, {
          preserveScroll: true,
          preserveState: true,
          forceFormData: true,
          onStart: () => {
            toast.loading("Updating kelas data...", { id: "update-toast" });
          },
          onSuccess: () => {
            setCurrentAction(null);
            setIsAnyPending(false);
            toast.success("Kelas updated successfully", {
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
        setCurrentKelas(null);
      }, 500);
    }
  }, []);

  // Empty state
  if (kelas.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Calendar]}
          title="No Kelas data yet"
          description="Start by adding your first kelas"
          action={{
            label: "Add Kelas",
            onClick: () => setOpenCreate(true),
          }}
        />
        <CreateKelasSheet
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
        <KelasTable
          data={kelas}
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
        totalCount={kelas.length}
        route="/dashboard/kelas"
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

      {currentKelas && (
        <UpdateKelasSheet
          kelas={currentKelas}
          open={openUpdate}
          onOpenChange={handleUpdateClose}
        />
      )}

      <CreateKelasSheet
      trigger
        open={openCreate}
        onOpenChange={() => setOpenCreate(!openCreate)}
      />
    </>
  );
}