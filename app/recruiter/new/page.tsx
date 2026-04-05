import { CreateJobForm } from "@/components/create-job-form";

export default function RecruiterNewJobPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Post a new job</h1>
        <p className="text-sm text-muted-foreground">
          Create a listing for your opening. Only recruiters can publish jobs.
        </p>
      </div>
      <CreateJobForm />
    </div>
  );
}
