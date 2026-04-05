import { z } from "zod";

function parseOptionalSalary(raw: string | undefined): number | undefined {
  if (raw == null || !String(raw).trim()) return undefined;
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : NaN;
}

export const createJobFormSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    skillsInput: z.string().optional(),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    jobType: z.enum(
      ["full-time", "part-time", "contract"],
      "Select a job type"
    ),
    location: z.string().min(1, "Location is required"),
    deadline: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const min = parseOptionalSalary(val.salaryMin);
    const max = parseOptionalSalary(val.salaryMax);

    if (val.salaryMin != null && String(val.salaryMin).trim() && Number.isNaN(min!)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid number",
        path: ["salaryMin"],
      });
    }
    if (val.salaryMax != null && String(val.salaryMax).trim() && Number.isNaN(max!)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid number",
        path: ["salaryMax"],
      });
    }
    if (
      min !== undefined &&
      max !== undefined &&
      !Number.isNaN(min) &&
      !Number.isNaN(max) &&
      max < min
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum must be greater than or equal to minimum",
        path: ["salaryMax"],
      });
    }
  });

export type CreateJobFormValues = z.infer<typeof createJobFormSchema>;

export type CreateJobPayload = {
  title: string;
  description: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobType: "full-time" | "part-time" | "contract";
  location: string;
  deadline?: string;
};

export function toCreateJobPayload(values: CreateJobFormValues): CreateJobPayload {
  const skills = values.skillsInput
    ?.split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const min = parseOptionalSalary(values.salaryMin);
  const max = parseOptionalSalary(values.salaryMax);

  let deadline: string | undefined;
  if (values.deadline?.trim()) {
    deadline = new Date(`${values.deadline.trim()}T12:00:00.000Z`).toISOString();
  }

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    ...(skills?.length ? { skills } : {}),
    ...(typeof min === "number" && !Number.isNaN(min) ? { salaryMin: min } : {}),
    ...(typeof max === "number" && !Number.isNaN(max) ? { salaryMax: max } : {}),
    jobType: values.jobType,
    location: values.location.trim(),
    ...(deadline ? { deadline } : {}),
  };
}
