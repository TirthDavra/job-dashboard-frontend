import { z } from "zod";

export const candidateProfileFormSchema = z.object({
  skillsInput: z.string().optional(),
  experience: z.coerce.number().min(0).max(50),
});

export type CandidateProfileFormValues = z.infer<
  typeof candidateProfileFormSchema
>;

export function toProfilePayload(values: CandidateProfileFormValues) {
  const skills =
    values.skillsInput
      ?.split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return {
    skills,
    experience: values.experience,
  };
}
