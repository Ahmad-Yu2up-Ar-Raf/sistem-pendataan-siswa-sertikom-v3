// resources/js/components/admin/UserDataTable.tsx
import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Key, Users2Icon } from "lucide-react";
import { EmptyState } from "@/components/ui/fragments/custom-ui/empty-state";
 
import DeleteDialog from "@/components/ui/fragments/custom-ui/dialog/DeleteDialog";
import CreateUserSheet from "../../sheet/create-sheet/create-user-sheet";
import UpdateUserSheet from "../../sheet/update-sheet/update-admin-sheet";
import { TableToolbar } from "@/components/ui/fragments/custom-ui/table/TableToolbar";
import { Pagination } from "@/components/ui/fragments/custom-ui/table/data-table-paggination";
import { useTableFilters } from "@/hooks/filters/useTableFilters"; // ← UPDATED IMPORT
import type { pagePropsAdmin } from "@/pages/dashboard/admin";
import type { UserSchema } from "@/lib/validations/auth/auth";
import { cn } from "@/lib/utils";
import { UserTable } from "./components/UserTable";
 
import { DateRange } from "react-day-picker";
 
import { RoleOptions, RoleValues } from "@/config/enums/Roles";
import { selectData, StatusTableActionBar } from "@/components/ui/fragments/custom-ui/table/action-bar/status-action-bar";
 

export default function UserDataTable({ data }: { data: pagePropsAdmin }) {
  const paginatedData = data.meta.pagination;
  const user = data.data.users;
  const initialFilters = data.meta.filters;

  // State management
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedId, setDeletedId] = React.useState<number | null>(null);
  const [currentUser, setCurrentUser] = React.useState<UserSchema | null>(null);
  const [processing, setProcessing] = React.useState(false);
 const selectData : selectData[] = [
      {
        Icon: Key,
        Data : RoleOptions,
        field: "roles"
  
      },
      
    ]
  // ✅ UPDATED: Use new useTableFilters hook
  const { 
    filters, 
    setSearch, 
    setEnumFilter, 
    setDateRange,
    clearFilters, 
    hasActiveFilters 
  } = useTableFilters({
    initialFilters,
    route: "/dashboard/admin",
  });

  // ✅ UPDATED: Filter configurations with type support (enum, relation, date-range)
  const filterConfigs = React.useMemo(
    () => [
      {
        column: "roles",
        title: "Roles",
        type: "enum" as const,
        options: RoleOptions,
      },
      {
        column: "created_at",
        title: "Tanggal Dibuat",
        type: "date-range" as const,
      },
    ],
    []
  );

  // ✅ UPDATED: Handle filter changes (enum arrays, date ranges)
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

  // Selection logic (unchanged)
  const allIds: number[] = React.useMemo(
    () => user.map((item) => item.id!),
    [user]
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

  // CRUD operations (unchanged)
  const handleEdit = React.useCallback((item: UserSchema) => {
    setCurrentUser(item);
    setOpenUpdate(true);
  }, []);

  const handleDelete = React.useCallback((taskId: number) => {
    setProcessing(true);
    toast.loading("Deleting User...", { id: "user-delete" });

    router.delete(`/dashboard/admin/destroy`, {
      data: { ids: [taskId] },
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("User deleted successfully", {
          id: "user-delete",
        });
        setOpenDelete(false);
        setDeletedId(null);
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the user", {
          id: "user-delete",
        });
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  }, []);

  // Bulk actions (unchanged)
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<string | null>(null);
  const [isAnyPending, setIsAnyPending] = React.useState<boolean>(false);

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction("delete");
    setIsAnyPending(true);
    toast.loading("Deleting data...", { id: "user-delete" });

    startTransition(() => {
      router.delete(`/dashboard/admin/${selectedIds}`, {
        data: { ids: selectedIds },
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("User deleted successfully", {
            id: "user-delete",
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
          toast.error(errors?.message || "Failed to delete user", {
            id: "user-delete",
          });
        },
      });
    });
  }, [selectedIds]);

const onTaskUpdate = React.useCallback(
  ({ field, value }: { field: string; value: string | string[] }) => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("Pilih minimal satu user terlebih dahulu.");
      return;
    }

    setIsAnyPending(true);
    setCurrentAction("update-roles");

    // normalisasi value jadi array of role names
    const rolesArray = Array.isArray(value)
      ? value
      : value
          .toString()
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);

    // payload: ids + roles
    const payload = {
      ids: selectedIds,
      roles: rolesArray,
    };

    startTransition(() => {
      // gunakan 'patch' (atau post jika backend pakai post)
      router.post("/dashboard/admin/bulk-roles", payload, {
        preserveScroll: true,
        preserveState: true,
        // forceFormData: false, <-- default, don't force to FormData unless needed
        onStart: () => {
          toast.loading("Updating user data...", { id: "update-toast" });
        },
        onSuccess: () => {
          setCurrentAction(null);
          setIsAnyPending(false);
          toast.success("User roles updated successfully", {
            id: "update-toast",
          });
        },
        onError: (errors: Record<string, any>) => {
          setCurrentAction(null);
          setIsAnyPending(false);
          console.error("Update error:", errors);
          toast.error("Update failed. Check console for details.", {
            id: "update-toast",
          });
        },
        onFinish: () => {
          setCurrentAction(null);
          setIsAnyPending(false);
        },
      });
    });
  },
  [selectedIds, router]
);


  const handleUpdateClose = React.useCallback((open: boolean) => {
    setOpenUpdate(open);
    if (!open) {
      setTimeout(() => {
        setCurrentUser(null);
      }, 500);
    }
  }, []);

  // Empty state
  if (user.length === 0 && filters.search === "" && !hasActiveFilters) {
    return (
      <>
        <EmptyState
          icons={[Users2Icon]}
          title="Belum ada data User"
          description="Mulailah dengan menambahkan yang pertama"
          action={{
            label: "Tambahkan User",
            onClick: () => setOpenCreate(true),
          }}
        />
        <CreateUserSheet
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
        {/* ✅ UPDATED: TableToolbar with new filter support */}
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

        {/* Table */}
        <UserTable
          data={user}
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
        totalCount={user.length}
        route="/dashboard/admin"
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

      {currentUser && (
        <UpdateUserSheet
          user={currentUser}
          open={openUpdate}
          onOpenChange={handleUpdateClose}
        />
      )}

      <CreateUserSheet
        trigger
        open={openCreate}
        onOpenChange={() => setOpenCreate(!openCreate)}
      />
    </>
  );
}