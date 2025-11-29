// resources/js/components/tahun-ajar/TahunAjarDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
import { StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/status-action-bar";
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateTahunAjarSheet from "../../sheet/create-sheet/create-tahun-ajar-sheet";
import UpdateTahunAjarSheet from "../../sheet/update-sheet/update-tahun-ajar-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";
import { TahunAjarTable } from "@/components/ui/core/app/actions/table/tahun_ajar/components/TahunAjarTable";
import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useFilters } from "@/hooks/filters/useFilters";
import type { pagePropsTahunAjar } from "@/pages/dashboard/tahun_ajar";
import type { TahunAjarSchema } from "@/lib/validations/tahunAjarValidate";
import { StatusOptions } from "@/config/enums/status";
import { cn } from "@/lib/utils";

export default function TahunAjarDataTable({ data }: { data: pagePropsTahunAjar }) {
  const paginatedData = data.meta.pagination;
  const tahunAjar = data.data.tahunAjar;
  const initialFilters = data.meta.filters;

  // State management
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedId, setDeletedId] = React.useState<number | null>(null);
  const [currentTahunAjar, setCurrentTahunAjar] =
    React.useState<TahunAjarSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);

  // Filter hook
  const { filters, setSearch, setEnumFilter, clearFilters, hasActiveFilters } =
    useFilters({
      initialFilters,
      route: "/dashboard/tahun_ajar",
    });

  // Filter configurations (reusable for multiple enum columns)
  const filterConfigs = React.useMemo(
    () => [
      {
        column: "status",
        title: "Status",
        options: StatusOptions,
      },
      // Add more filter configs here for other enum columns:
      // { column: "semester", title: "Semester", options: SemesterOptions },
    ],
    []
  );

  // Selection logic
  const allIds: number[] = React.useMemo(
    () => tahunAjar.map((item) => item.id!),
    [tahunAjar]
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
  const handleEdit = React.useCallback((item: TahunAjarSchema) => {
    setCurrentTahunAjar(item);
    setOpenUpdate(true);
  }, []);

  const handleDelete = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting Tahun Ajar...", { id: "tahun_ajar-delete" });

    router.delete(`/dashboard/tahun_ajar/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Tahun Ajar deleted successfully", {
          id: "tahun_ajar-delete",
        });
        setOpenDelete(false);
        setDeletedId(null);
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the tahun ajar", {
          id: "tahun_ajar-delete",
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
    toast.loading("Deleting data...", { id: "tahun_ajar-delete" });

    startTransition(() => {
      router.delete(`/dashboard/tahun_ajar/${selectedIds}`, {
        data: { ids: selectedIds },
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("Tahun Ajar deleted successfully", {
            id: "tahun_ajar-delete",
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
          toast.error(errors?.message || "Failed to delete tahun ajar", {
            id: "tahun_ajar-delete",
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

        router.post(`/dashboard/tahun_ajar/${selectedIds}/status`, formData, {
          preserveScroll: true,
          preserveState: true,
          forceFormData: true,
          onStart: () => {
            toast.loading("Updating tahun ajar data...", { id: "update-toast" });
          },
          onSuccess: () => {
            setCurrentAction(null);
            setIsAnyPending(false);
            toast.success("Tahun Ajar updated successfully", {
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
        setCurrentTahunAjar(null);
      }, 500);
    }
  }, []);

  // Empty state
  if (tahunAjar.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Calendar]}
          title="No Tahun Ajar data yet"
          description="Start by adding your first tahun ajar"
          action={{
            label: "Add Tahun Ajar",
            onClick: () => setOpenCreate(true),
          }}
        />
        <CreateTahunAjarSheet
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
        <TahunAjarTable
          data={tahunAjar}
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
        totalCount={tahunAjar.length}
        route="/dashboard/tahun_ajar"
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

      {currentTahunAjar && (
        <UpdateTahunAjarSheet
          tahunAjar={currentTahunAjar}
          open={openUpdate}
          onOpenChange={handleUpdateClose}
        />
      )}

      <CreateTahunAjarSheet
      trigger
        open={openCreate}
        onOpenChange={() => setOpenCreate(!openCreate)}
      />
    </>
  );
}