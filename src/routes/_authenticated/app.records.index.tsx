import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteRecord, fetchRecords, updateRecord } from "@/lib/data";
import { RECORD_STATUSES, RECORD_TYPES, recordTypeLabel, statusLabel } from "@/lib/records";

export const Route = createFileRoute("/_authenticated/app/records/")({
  component: RecordsLibrary,
});

function RecordsLibrary() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["records"], queryFn: fetchRecords });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      toast.success("Record deleted.");
      qc.invalidateQueries({ queryKey: ["records"] });
    },
    onError: () => toast.error("That record could not be deleted."),
  });

  const archive = useMutation({
    mutationFn: (id: string) => updateRecord(id, { status: "archived" }, "Record archived"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["records"] }),
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.event_description ?? "").toLowerCase().includes(search.toLowerCase());
      return (
        matchesSearch && (type === "all" || r.record_type === type) && (status === "all" || r.status === status)
      );
    });
  }, [data, search, type, status]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">Business Records</h1>
        <Button asChild>
          <Link to="/app/records/new">
            <Plus className="size-4" /> Create new record
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search by title or content"
            aria-label="Search records"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Filter by record type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All record types</SelectItem>
            {RECORD_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {RECORD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <Skeleton className="h-40 w-full" /> : null}
      {error ? (
        <p className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
          Your records could not be loaded. Check your connection and try again.
        </p>
      ) : null}

      {!isLoading && rows.length === 0 ? (
        <Card className="py-14 text-center">
          <CardContent className="space-y-4">
            <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-base font-medium">No records yet.</p>
            <p className="text-sm text-muted-foreground">
              Document your first important business decision.
            </p>
            <Button asChild>
              <Link to="/app/records/new">Create business record</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <CardTitle className="text-base">{r.title}</CardTitle>
              <Badge variant="outline">{statusLabel(r.status)}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{recordTypeLabel(r.record_type)}</p>
              <p>
                Created {new Date(r.created_at).toLocaleDateString()} · Last edited{" "}
                {new Date(r.updated_at).toLocaleDateString()}
              </p>
              {r.event_description ? <p className="line-clamp-2">{r.event_description}</p> : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm">
                  <Link to="/app/records/$id" params={{ id: r.id }}>
                    Open
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => archive.mutate(r.id)}>
                  Archive
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(r.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record from your workspace. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) remove.mutate(pendingDelete);
                setPendingDelete(null);
              }}
            >
              Delete record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
