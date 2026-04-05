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

export function CandidateJobFilters({
  limit,
  defaultQ,
  defaultJobType,
  defaultLocation,
}: Props) {
  return (
    <form action="/candidate" method="get" className="flex flex-col gap-4">
      <input type="hidden" name="page" value="1" />
      <input type="hidden" name="limit" value={String(limit)} />

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

        <Button type="submit" className="w-full sm:w-auto">
          Apply filters
        </Button>
      </div>
    </form>
  );
}
