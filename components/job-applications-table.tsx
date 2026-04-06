"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplicationRow,
} from "@/api/application/types";
import { updateApplicationStatus } from "@/api/application/application.api";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function labelStatus(s: ApplicationStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatAppliedAt(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Props = {
  applications: JobApplicationRow[];
  error: string | null;
};

export function JobApplicationsTable({
  applications: initialRows,
  error,
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [active, setActive] = useState<JobApplicationRow | null>(null);
  const [nextStatus, setNextStatus] = useState<ApplicationStatus>("applied");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const openChangeStatus = (row: JobApplicationRow) => {
    setActive(row);
    setNextStatus(row.status);
    setDialogOpen(true);
  };

  async function handleSaveStatus() {
    if (!active) return;
    setSaving(true);
    const prev = rows;
    setRows((r) =>
      r.map((x) =>
        x._id === active._id ? { ...x, status: nextStatus } : x
      )
    );
    try {
      await updateApplicationStatus(active._id, nextStatus);
      toast.success("Status updated");
      setDialogOpen(false);
      setActive(null);
      router.refresh();
    } catch (err) {
      setRows(prev);
      toast.error(
        getApiErrorMessage(err, "Could not update status. Try again.")
      );
    } finally {
      setSaving(false);
    }
  }

  const columns: ColumnDef<JobApplicationRow>[] = [
    {
      accessorKey: "candidateId",
      header: "Candidate",
      cell: ({ row }) => {
        const c = row.original.candidateId;
        if (!c) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{c.name}</span>
            <span className="text-xs text-muted-foreground">{c.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ row }) => formatAppliedAt(row.original.createdAt),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => labelStatus(row.original.status),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openChangeStatus(row.original)}>
              Change status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <p className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No applications for this job yet.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Change status</DialogTitle>
            <DialogDescription>
              {active?.candidateId
                ? `${active.candidateId.name} — update pipeline status for this application.`
                : "Update status for this application."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="app-status">Status</Label>
            <select
              id="app-status"
              className={cn(selectClass)}
              value={nextStatus}
              onChange={(e) =>
                setNextStatus(e.target.value as ApplicationStatus)
              }
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {labelStatus(s)}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveStatus}
              disabled={saving || !active || nextStatus === active.status}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
