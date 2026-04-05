"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJob } from "@/api/job/job.api";
import {
  createJobFormSchema,
  toCreateJobPayload,
  type CreateJobFormValues,
} from "@/api/job/schemas";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

export function CreateJobForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [rootError, setRootError] = useState<string | null>(null);

  const form = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      skillsInput: "",
      salaryMin: "",
      salaryMax: "",
      jobType: "full-time",
      location: "",
      deadline: "",
    },
  });

  async function onSubmit(values: CreateJobFormValues) {
    setRootError(null);
    try {
      const payload = toCreateJobPayload(values);
      const data = await createJob(payload);
      toast.success(data.message);
      form.reset({
        title: "",
        description: "",
        skillsInput: "",
        salaryMin: "",
        salaryMax: "",
        jobType: "full-time",
        location: "",
        deadline: "",
      });
      router.push("/recruiter/jobs");
    } catch (err) {
      setRootError(
        getApiErrorMessage(err, "Could not publish this job. Try again.")
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
          <CardDescription>
            Candidates will see this information on the job board. You can edit
            or close listings later from Manage jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {rootError ? (
                <Field>
                  <FieldError>{rootError}</FieldError>
                </Field>
              ) : null}
              <Field data-invalid={!!form.formState.errors.title}>
                <FieldLabel htmlFor="job-title">Job title</FieldLabel>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Full-stack Engineer"
                  aria-invalid={!!form.formState.errors.title}
                  {...form.register("title")}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.description}>
                <FieldLabel htmlFor="job-description">Description</FieldLabel>
                <Textarea
                  id="job-description"
                  placeholder="Role summary, responsibilities, and what you are looking for..."
                  rows={6}
                  aria-invalid={!!form.formState.errors.description}
                  {...form.register("description")}
                />
                <FieldError errors={[form.formState.errors.description]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.skillsInput}>
                <FieldLabel htmlFor="job-skills">Skills</FieldLabel>
                <Input
                  id="job-skills"
                  placeholder="e.g. TypeScript, React, Node.js"
                  aria-invalid={!!form.formState.errors.skillsInput}
                  {...form.register("skillsInput")}
                />
                <FieldDescription>
                  Separate skills with commas. Optional.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.skillsInput]} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field data-invalid={!!form.formState.errors.salaryMin}>
                  <FieldLabel htmlFor="salary-min">Salary min (optional)</FieldLabel>
                  <Input
                    id="salary-min"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 80000"
                    aria-invalid={!!form.formState.errors.salaryMin}
                    {...form.register("salaryMin")}
                  />
                  <FieldError errors={[form.formState.errors.salaryMin]} />
                </Field>
                <Field data-invalid={!!form.formState.errors.salaryMax}>
                  <FieldLabel htmlFor="salary-max">Salary max (optional)</FieldLabel>
                  <Input
                    id="salary-max"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 120000"
                    aria-invalid={!!form.formState.errors.salaryMax}
                    {...form.register("salaryMax")}
                  />
                  <FieldError errors={[form.formState.errors.salaryMax]} />
                </Field>
              </div>
              <Controller
                name="jobType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="job-type">Job type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="job-type"
                        className="w-full min-w-full"
                        aria-invalid={!!fieldState.error}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Field data-invalid={!!form.formState.errors.location}>
                <FieldLabel htmlFor="job-location">Location</FieldLabel>
                <Input
                  id="job-location"
                  placeholder="e.g. Remote, New York, Hybrid — London"
                  aria-invalid={!!form.formState.errors.location}
                  {...form.register("location")}
                />
                <FieldError errors={[form.formState.errors.location]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.deadline}>
                <FieldLabel htmlFor="job-deadline">Application deadline</FieldLabel>
                <Input
                  id="job-deadline"
                  type="date"
                  aria-invalid={!!form.formState.errors.deadline}
                  {...form.register("deadline")}
                />
                <FieldDescription>Optional. Leave blank for no deadline.</FieldDescription>
                <FieldError errors={[form.formState.errors.deadline]} />
              </Field>
              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Publishing…" : "Publish job"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
