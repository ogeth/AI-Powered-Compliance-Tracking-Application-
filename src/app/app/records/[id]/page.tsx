"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Printer, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchRecord, updateRecord, uploadDocument } from "@/lib/data";
import { recordTypeLabel, statusLabel, type DocumentSection } from "@/lib/records";
import { DISCLAIMER_SHORT, track } from "@/lib/product";

export default function RecordEditor() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["record", id],
    queryFn: () => fetchRecord(id),
  });
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setSections(data.generated_content?.sections ?? []);
      setTitle(data.title);
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading record…</p>;
  if (error || !data)
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">That record could not be found in your workspace.</p>
        <Button asChild variant="outline">
          <Link href="/app/records">Back to records</Link>
        </Button>
      </div>
    );

  const completed = data.status === "completed";

  async function persist(values: Parameters<typeof updateRecord>[1], message: string) {
    setSaving(true);
    try {
      await updateRecord(id, values, message);
      await qc.invalidateQueries({ queryKey: ["record", id] });
      await qc.invalidateQueries({ queryKey: ["records"] });
      toast.success(message);
    } catch {
      toast.error("Your change could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file, { category: "signed_record", record_id: id });
      track("signed_copy_uploaded");
      await persist({ status: "completed", completed_at: new Date().toISOString() }, "Signed copy uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The file could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Document title"
            className="max-w-xl text-lg font-semibold"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {recordTypeLabel(data.record_type)} · {statusLabel(data.status)} · Last edited{" "}
            {new Date(data.updated_at).toLocaleDateString()}
          </p>
        </div>
        {!completed ? (
          <Badge variant="outline" className="border-attention/50 bg-attention-soft text-attention-foreground">
            Draft for review
          </Badge>
        ) : (
          <Badge variant="outline" className="border-primary/40 bg-success-soft text-primary">
            Completed
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="print-only-document">
          <CardHeader className="no-print">
            <CardTitle className="text-base">Document</CardTitle>
            <p className="text-sm text-muted-foreground">{DISCLAIMER_SHORT}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="space-y-1">
                <Label htmlFor={`sec-${section.id}`} className="text-xs uppercase tracking-wide">
                  {section.heading}
                </Label>
                <Textarea
                  id={`sec-${section.id}`}
                  className="document-surface"
                  rows={Math.min(12, section.body.split("\n").length + 2)}
                  value={section.body}
                  onChange={(e) => {
                    const next = [...sections];
                    next[index] = { ...section, body: e.target.value };
                    setSections(next);
                  }}
                />
              </div>
            ))}
            {!completed ? (
              <p className="text-xs text-muted-foreground">
                Draft generated from information provided by the user.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <aside className="space-y-4 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Document status</p>
                <p>{statusLabel(data.status)}</p>
              </div>
              {(
                [
                  ["Facts used", data.facts_used],
                  ["Assumptions", data.assumptions],
                  ["Missing information", data.missing_information],
                  ["Risk flags", data.risk_flags],
                ] as [string, string[]][]
              ).map(([label, items]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  {items?.length ? (
                    <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">None identified.</p>
                  )}
                </div>
              ))}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Template version</p>
                <p className="text-muted-foreground">{data.template_version}</p>
              </div>
              {data.professional_review_recommended ? (
                <p className="rounded-lg bg-attention-soft p-3 text-attention-foreground">
                  Professional review recommended.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                onClick={() => persist({ title, generated_content: { sections } }, "Draft saved")}
                disabled={saving}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save draft
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  track("pdf_exported", { record_type: data.record_type });
                  window.print();
                }}
              >
                <Printer className="size-4" /> Print / Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  track("record_marked_awaiting_signature");
                  persist({ status: "awaiting_signature" }, "Marked as awaiting signature");
                }}
              >
                Mark as awaiting signature
              </Button>
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload signed copy
                  <input type="file" className="sr-only" onChange={(e) => onUpload(e.target.files?.[0])} />
                </label>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/app/records">Back to records</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
