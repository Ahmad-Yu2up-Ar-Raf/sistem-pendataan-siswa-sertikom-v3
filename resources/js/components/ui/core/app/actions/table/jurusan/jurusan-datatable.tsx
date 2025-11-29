// resources/js/components/jurusan/JurusanDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
import { StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/status-action-bar";
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateJurusanSheet from "../../sheet/create-sheet/create-jurusan-sheet";
import UpdateJurusanSheet from "../../sheet/update-sheet/update-jurusan-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";
import { JurusanTable } from "./components/JurusanTable";
import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useFilters } from "@/hooks/filters/useFilters";
import type { pagePropsJurusan } from "@/pages/dashboard/jurusan/index";
import type { JurusanSchema } from "@/lib/validations/jurusanValidate";
import { StatusOptions } from "@/config/enums/status";
import { cn } from "@/lib/utils";

export default function JurusanDataTable({ data }: { data: pagePropsJurusan }) {
  const paginatedData = data.meta.pagination;
  const jurusan = data.data.jurusan;
  const initialFilters = data.meta.filters;

  // State management
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedId, setDeletedId] = React.useState<number | null>(null);
  const [currentJurusan, setCurrentJurusan] =
    React.useState<JurusanSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);

  // Filter hook
  const { filters, setSearch, setEnumFilter, clearFilters, hasActiveFilters } =
    useFilters({
      initialFilters,
      route: "/dashboard/jurusan",
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
    () => jurusan.map((item) => item.id!),
    [jurusan]
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
  const handleEdit = React.useCallback((item: JurusanSchema) => {
    setCurrentJurusan(item);
    setOpenUpdate(true);
  }, []);

  const handleDelete = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting Jurusan...", { id: "jurusan-delete" });

    router.delete(`/dashboard/jurusan/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Jurusan deleted successfully", {
          id: "jurusan-delete",
        });
        setOpenDelete(false);
        setDeletedId(null);
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the jurusan", {
          id: "jurusan-delete",
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
    toast.loading("Deleting data...", { id: "jurusan-delete" });

    startTransition(() => {
      router.delete(`/dashboard/jurusan/${selectedIds}`, {
        data: { ids: selectedIds },
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("Jurusan deleted successfully", {
            id: "jurusan-delete",
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
          toast.error(errors?.message || "Failed to delete jurusan", {
            id: "jurusan-delete",
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

        router.post(`/dashboard/jurusan/${selectedIds}/status`, formData, {
          preserveScroll: true,
          preserveState: true,
          forceFormData: true,
          onStart: () => {
            toast.loading("Updating jurusan data...", { id: "update-toast" });
          },
          onSuccess: () => {
            setCurrentAction(null);
            setIsAnyPending(false);
            toast.success("Jurusan updated successfully", {
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
        setCurrentJurusan(null);
      }, 500);
    }
  }, []);

  // Empty state
  if (jurusan.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Calendar]}
          title="No Jurusan data yet"
          description="Start by adding your first jurusan"
          action={{
            label: "Add Jurusan",
            onClick: () => setOpenCreate(true),
          }}
        />
        <CreateJurusanSheet
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
        <JurusanTable
          data={jurusan}
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
        totalCount={jurusan.length}
        route="/dashboard/jurusan"
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

      {currentJurusan && (
        <UpdateJurusanSheet
          jurusan={currentJurusan}
          open={openUpdate}
          onOpenChange={handleUpdateClose}
        />
      )}

      <CreateJurusanSheet
      trigger
        open={openCreate}
        onOpenChange={() => setOpenCreate(!openCreate)}
      />
    </>
  );
}