import { CandidateProfileForm } from "@/components/candidate-profile-form";
import { getMyProfile } from "@/api/profile/profile.api";
import { getApiErrorMessage } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  let initialUser = null;
  let loadError: string | null = null;

  try {
    const res = await getMyProfile();
    initialUser = res.user;
  } catch (err) {
    loadError = getApiErrorMessage(
      err,
      "Could not load your profile. Try refreshing."
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Keep your skills and experience up to date for recruiters.
        </p>
      </div>
      <CandidateProfileForm
        key={
          initialUser
            ? `${initialUser._id}-${String(initialUser.updatedAt ?? "")}`
            : "profile-new"
        }
        initialUser={initialUser}
        loadError={loadError}
      />
    </div>
  );
}
