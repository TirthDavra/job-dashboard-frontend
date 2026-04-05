"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
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
import { updateMyProfile } from "@/api/profile/profile.api";
import {
  candidateProfileFormSchema,
  toProfilePayload,
  type CandidateProfileFormValues,
} from "@/api/profile/schemas";
import type { CandidateProfileUser } from "@/api/profile/types";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

type Props = {
  initialUser: CandidateProfileUser | null;
  loadError: string | null;
};

export function CandidateProfileForm({
  initialUser,
  loadError,
  className,
  ...props
}: Props & React.ComponentProps<"div">) {
  const router = useRouter();
  const [rootError, setRootError] = useState<string | null>(null);

  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(
      candidateProfileFormSchema
    ) as Resolver<CandidateProfileFormValues>,
    defaultValues: {
      skillsInput: initialUser?.skills?.length
        ? initialUser.skills.join(", ")
        : "",
      experience: initialUser?.experience ?? 0,
    },
  });

  async function onSubmit(values: CandidateProfileFormValues) {
    setRootError(null);
    try {
      const payload = toProfilePayload(values);
      const res = await updateMyProfile(payload);
      toast.success(res.message);
      router.refresh();
    } catch (err) {
      setRootError(
        getApiErrorMessage(err, "Could not save profile. Try again.")
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>
            Add your skills and years of experience. Resume upload will be added
            later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {loadError ? (
                <Field>
                  <FieldError>{loadError}</FieldError>
                </Field>
              ) : null}
              {rootError ? (
                <Field>
                  <FieldError>{rootError}</FieldError>
                </Field>
              ) : null}
              <Field data-invalid={!!form.formState.errors.skillsInput}>
                <FieldLabel htmlFor="profile-skills">Skills</FieldLabel>
                <Input
                  id="profile-skills"
                  placeholder="e.g. React, Node, SQL"
                  aria-invalid={!!form.formState.errors.skillsInput}
                  {...form.register("skillsInput")}
                />
                <FieldDescription>Separate with commas.</FieldDescription>
                <FieldError errors={[form.formState.errors.skillsInput]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.experience}>
                <FieldLabel htmlFor="profile-experience">
                  Years of experience
                </FieldLabel>
                <Input
                  id="profile-experience"
                  type="number"
                  min={0}
                  max={50}
                  step={1}
                  aria-invalid={!!form.formState.errors.experience}
                  {...form.register("experience", { valueAsNumber: true })}
                />
                <FieldError errors={[form.formState.errors.experience]} />
              </Field>
              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving…" : "Save profile"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
