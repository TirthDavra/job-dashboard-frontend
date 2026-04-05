"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { applyToJob } from "@/api/application/application.api";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

type Props = {
  jobId: string;
  isOpen: boolean;
  alreadyApplied: boolean;
};

export function JobApplyButton({
  jobId,
  isOpen,
  alreadyApplied,
}: Props) {
  const router = useRouter();
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApplied(alreadyApplied);
  }, [alreadyApplied]);

  async function handleApply() {
    setLoading(true);
    try {
      const res = await applyToJob(jobId);
      toast.success(res.message);
      setApplied(true);
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not submit application."));
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Button type="button" size="sm" variant="secondary" disabled>
        Closed
      </Button>
    );
  }

  if (applied) {
    return (
      <Button type="button" size="sm" variant="outline" disabled>
        Applied
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleApply}
      disabled={loading}
    >
      {loading ? "Applying…" : "Apply"}
    </Button>
  );
}
