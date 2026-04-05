"use client";

import { useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
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
import { recruiterJobsColumns } from "@/components/recruiter-jobs-columns";
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
  const columns = useMemo(() => recruiterJobsColumns, []);

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
