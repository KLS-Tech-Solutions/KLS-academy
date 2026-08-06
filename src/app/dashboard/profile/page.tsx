"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/misc";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { useJourney } from "@/hooks/use-journey";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { journey } = useJourney();
  const { user, profile } = journey;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <DashboardHeader
        title="Profile"
        description="Keep these details current — they appear on your offer letter and certificate."
      />

      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Avatar name={user.full_name} className="size-16 text-lg" />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ink">{user.full_name}</p>
          <p className="text-[15px] text-body">{user.email}</p>
          <p className="mt-1 text-[13px] text-muted">
            Member since {formatDate(user.created_at)}
          </p>
        </div>
      </Card>

      <ProfileForm user={user} profile={profile} />
    </div>
  );
}
