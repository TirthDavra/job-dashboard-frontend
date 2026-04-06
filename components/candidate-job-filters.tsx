"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  limit: number;
  defaultQ: string;
  defaultJobType: string;
  defaultLocation: string;
};

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

/**
 * Updates the URL query (same as pagination links). The server page reads
 * searchParams and loads filtered data — no full document reload.
 */
export function CandidateJobFilters({
  limit,
  defaultQ,
  defaultJobType,
  defaultLocation,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", String(limit));

    const q = String(fd.get("q") ?? "").trim();
    const jobType = String(fd.get("jobType") ?? "").trim();
    const location = String(fd.get("location") ?? "").trim();

    if (q) params.set("q", q);
    if (jobType) params.set("jobType", jobType);
    if (location) params.set("location", location);

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/candidate?${qs}` : "/candidate", { scroll: false });
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="grid w-full min-w-[200px] flex-1 gap-2">
          <Label htmlFor="job-search-q">Search</Label>
          <Input
            id="job-search-q"
            name="q"
            placeholder="Title, description, or skill"
            defaultValue={defaultQ}
          />
        </div>

        <div className="grid w-full min-w-[160px] gap-2 sm:w-44">
          <Label htmlFor="job-filter-type">Job type</Label>
          <select
            id="job-filter-type"
            name="jobType"
            defaultValue={defaultJobType}
            className={cn(selectClass)}
          >
            <option value="">Any type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="grid w-full min-w-[160px] flex-1 gap-2">
          <Label htmlFor="job-filter-location">Location</Label>
          <Input
            id="job-filter-location"
            name="location"
            placeholder="City or remote"
            defaultValue={defaultLocation}
          />
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Applying…" : "Apply filters"}
        </Button>
      </div>
    </form>
  );
}
