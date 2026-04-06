"use client";

import { useCallback, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { recruiterJobsColumns } from "@/components/recruiter-jobs-columns";
import { closeJob, deleteJob } from "@/api/job/job.api";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import type { JobDto } from "@/api/job/types";

export type RecruiterJobsDataTableProps = {
  jobs: JobDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  error?: string | null;
};

function jobsListPath(page: number, limit: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  return `/recruiter/jobs?${params.toString()}`;
}

export function RecruiterJobsDataTable({
  jobs,
  page,
  limit,
  total,
  totalPages,
  error,
}: RecruiterJobsDataTableProps) {
  const router = useRouter();
  const [pendingJobIds, setPendingJobIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    jobId: string;
    jobTitle: string;
    type: "close" | "delete";
  } | null>(null);

  const setPending = (jobId: string, active: boolean) => {
    setPendingJobIds((prev) =>
      active ? [...prev, jobId] : prev.filter((id) => id !== jobId)
    );
  };

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setConfirmAction(null);
    }
    setDialogOpen(open);
  }, []);

  const openConfirmDialog = useCallback(
    (job: JobDto, type: "close" | "delete") => {
      setConfirmAction({
        jobId: job._id,
        jobTitle: job.title,
        type,
      });
      setDialogOpen(true);
    },
    []
  );

  const handleConfirmDialog = useCallback(async () => {
    if (!confirmAction) {
      return;
    }

    const { jobId, type } = confirmAction;
    setDialogOpen(false);
    setPending(jobId, true);

    try {
      if (type === "close") {
        await closeJob(jobId);
        toast.success("Job closed successfully.");
      } else {
        await deleteJob(jobId);
        toast.success("Job deleted successfully.");
      }
      router.refresh();
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          type === "close"
            ? "Could not close job. Try again."
            : "Could not delete job. Try again."
        )
      );
    } finally {
      setPending(jobId, false);
      setConfirmAction(null);
    }
  }, [confirmAction, router]);

  const handleCancelDialog = useCallback(() => {
    setDialogOpen(false);
    setConfirmAction(null);
  }, []);

  const actionColumn = useMemo<ColumnDef<JobDto>>(
    () => ({
      id: "row-actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        const isPending = pendingJobIds.includes(job._id);

        return (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/recruiter/jobs/${job._id}/applications`}>
                Applications
              </Link>
            </Button>

            {job.isOpen ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => openConfirmDialog(job, "close")}
              >
                {isPending ? "Closing…" : "Close"}
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Closed
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => openConfirmDialog(job, "delete")}
            >
              {isPending ? "Working…" : "Delete"}
            </Button>
          </div>
        );
      },
    }),
    [pendingJobIds, openConfirmDialog]
  );

  const columns = useMemo(
    () => [...recruiterJobsColumns, actionColumn],
    [actionColumn]
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const canPrevious = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No jobs yet. Post one from Add job.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original._id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "delete"
                ? "Delete job"
                : "Close job"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "delete"
                ? "This action cannot be undone. The job will be removed permanently."
                : "Candidates will no longer be able to apply after this job is closed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              onClick={handleConfirmDialog}
            >
              {confirmAction?.type === "delete" ? "Delete" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {error ? null : total === 0 ? (
            "0 jobs"
          ) : (
            <>
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {canPrevious ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={jobsListPath(page - 1, limit)}
                prefetch={true}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled aria-label="Previous page">
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {totalPages === 0 ? 1 : page}
            {totalPages > 0 ? ` of ${totalPages}` : ""}
          </span>
          {canNext ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={jobsListPath(page + 1, limit)}
                prefetch={true}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled aria-label="Next page">
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
