"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { JobDto } from "@/api/job/types";

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatJobType(value: JobDto["jobType"]): string {
  return value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

function formatSalary(job: JobDto): string {
  const { salaryMin, salaryMax } = job;
  if (salaryMin == null && salaryMax == null) return "—";
  if (salaryMin != null && salaryMax != null) {
    return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
  }
  if (salaryMin != null) return `From ${salaryMin.toLocaleString()}`;
  return `Up to ${salaryMax!.toLocaleString()}`;
}

export const recruiterJobsColumns: ColumnDef<JobDto>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[220px] font-medium whitespace-normal">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "jobType",
    header: "Type",
    cell: ({ row }) => formatJobType(row.original.jobType),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="max-w-[140px] truncate" title={row.original.location}>
        {row.original.location}
      </span>
    ),
  },
  {
    id: "salary",
    header: "Salary",
    cell: ({ row }) => (
      <span className="whitespace-normal">{formatSalary(row.original)}</span>
    ),
  },
  {
    accessorKey: "isOpen",
    header: "Status",
    cell: ({ row }) =>
      row.original.isOpen ? (
        <span className="text-emerald-600 dark:text-emerald-400">Open</span>
      ) : (
        <span className="text-muted-foreground">Closed</span>
      ),
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => formatDate(row.original.deadline),
  },
  {
    accessorKey: "createdAt",
    header: "Posted",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/recruiter/jobs/${row.original._id}/applications`}>
          Applications
        </Link>
      </Button>
    ),
  },
];
