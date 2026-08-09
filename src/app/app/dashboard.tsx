"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchActivity, fetchBusinessProfile, fetchRecords } from "@/lib/data";
import { statusLabel } from "@/lib/records";
import { useAuth } from "@/hooks/useAuth";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const { firstName } = useAuth();
  const business = useQuery({ queryKey: ["business"], queryFn: fetchBusinessProfile });
  const records = useQuery({ queryKey: ["records"], queryFn: fetchRecords });
  const activity = useQuery({ queryKey: ["activity"], queryFn: () => fetchActivity(6) });

  const rows = records.data ?? [];
  const counts = {
    total: rows.length,
    drafts: rows.filter((r) => r.status === "draft").length,
    awaiting: rows.filter((r) => r.status === "awaiting_signature").length,
    completed: rows.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {greeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is the latest activity for {business.data?.legal_name ?? "your business"}.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/records/new">
            Create business record <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-attention-soft p-4 text-sm text-attention-foreground">
        Your current workspace includes business-profile management and business-record generation.
        Personalized compliance requirements and deadline monitoring will be introduced progressively.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Business records</CardTitle>
          </CardHeader>
          <CardContent>
            {records.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Total records", counts.total],
                  ["Drafts", counts.drafts],
                  ["Awaiting signature", counts.awaiting],
                  ["Completed", counts.completed],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-lg border border-border p-4">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-2xl font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {!records.isLoading && counts.total === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                You have not created any business records yet.{" "}
                <Link href="/app/records/new" className="font-medium text-primary hover:underline">
                  Create your first record
                </Link>
                .
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.isLoading ? <Skeleton className="h-24 w-full" /> : null}
            {activity.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : null}
            {activity.data?.map((event) => (
              <div key={event.id} className="text-sm">
                <p className="text-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {business.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : business.data ? (
              <>
                <p>Entity type: {business.data.entity_type}</p>
                <p>State: {business.data.state_of_formation}</p>
                <p>
                  Ownership:{" "}
                  {business.data.ownership_type === "single_member" ? "Single-member" : "Multi-member"}
                </p>
                <p>
                  Management:{" "}
                  {business.data.management_structure === "manager_managed"
                    ? "Manager-managed"
                    : "Member-managed"}
                </p>
                <p>Operating agreement: {business.data.operating_agreement_status}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No business profile yet.</p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/app/business-profile">Review profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Compliance workspace</CardTitle>
            <Badge variant="secondary">Coming soon</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: MapPinned, label: "Compliance Map" },
              { icon: CalendarClock, label: "Calendar" },
              { icon: CalendarClock, label: "Deadline reminders" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground"
              >
                <item.icon className="mb-2 size-4" aria-hidden="true" />
                {item.label}
                <p className="mt-1 text-xs">Sample data — coming soon</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {rows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest records</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {rows.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                href={`/app/records/${r.id}`}
                className="flex items-center justify-between gap-4 py-3 text-sm hover:text-primary"
              >
                <span className="truncate font-medium">{r.title}</span>
                <Badge variant="outline">{statusLabel(r.status)}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
