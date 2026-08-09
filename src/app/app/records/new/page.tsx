"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createRecord, fetchBusinessProfile } from "@/lib/data";
import { generateDraft } from "@/lib/generation-service";
import {
  RECORD_TYPES,
  recordTypeLabel,
  sectionsToPlainText,
  type ContextAnswers,
  type GenerationOutput,
  type RecordType,
} from "@/lib/records";
import { DISCLAIMER_SHORT, PRODUCT_NAME, track } from "@/lib/product";

const STEPS = ["Describe", "Context", "Recommendation", "Draft", "Save"];

const RISK_QUESTIONS: { key: keyof ContextAnswers; label: string }[] = [
  { key: "involvesAnotherMember", label: "Does the decision involve another member?" },
  { key: "changesOwnership", label: "Does it change ownership percentages?" },
  { key: "involvesBorrowing", label: "Does it involve borrowing?" },
  { key: "amendsOperatingAgreement", label: "Does it amend the operating agreement?" },
  { key: "largeDistribution", label: "Does it involve a large owner distribution?" },
  { key: "relatedParty", label: "Is the transaction with a related party?" },
  { key: "taxElection", label: "Does it involve a tax election?" },
  { key: "sellsAssets", label: "Does it involve selling substantial business assets?" },
  { key: "dissolution", label: "Does it involve dissolution or a merger?" },
];

export default function Generator() {
  const router = useRouter();
  const business = useQuery({ queryKey: ["business"], queryFn: fetchBusinessProfile });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    description: "",
    eventDate: new Date().toISOString().slice(0, 10),
    effectiveDate: "",
    meetingOccurred: "no" as "yes" | "no" | "unsure",
    participants: "",
    approvers: "",
    notes: "",
  });
  const [answers, setAnswers] = useState<ContextAnswers>({ decidedBy: "member" });
  const [override, setOverride] = useState<RecordType | "">("");

  useEffect(() => {
    track("generator_started");
  }, []);

  useEffect(() => {
    if (business.isFetched && !business.data) {
      router.push("/app/onboarding?intent=record");
    }
  }, [business.isFetched, business.data, router]);

  const riskFlags = RISK_QUESTIONS.filter((q) => answers[q.key] === true).map((q) => q.label);

  function goDescribe() {
    const next: string[] = [];
    if (form.description.trim().length < 25)
      next.push("Describe what happened in a sentence or two so the draft has enough context.");
    if (!form.eventDate) next.push("Add the date the decision or meeting happened.");
    setErrors(next);
    if (next.length) return;
    track("description_submitted");
    setStep(1);
  }

  async function generate() {
    if (!business.data) return;
    setGenerating(true);
    try {
      const result = await generateDraft({
        business: business.data,
        description: form.description,
        eventDate: form.eventDate,
        effectiveDate: form.effectiveDate || form.eventDate,
        meetingOccurred: form.meetingOccurred,
        participants: form.participants,
        approvers: form.approvers,
        notes: form.notes,
        answers,
        ...(override ? { selectedRecordType: override as RecordType } : {}),
      });
      setOutput(result);
      track("draft_generated", { record_type: result.recordType });
      setStep(3);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "We could not generate the draft.");
    } finally {
      setGenerating(false);
    }
  }

  async function save() {
    if (!output || !business.data) return;
    setSaving(true);
    try {
      const row = await createRecord({
        business_id: business.data.id,
        title: output.title,
        record_type: output.recordType,
        status: output.professionalReviewRecommended ? "professional_review_recommended" : "draft",
        event_description: form.description,
        event_date: form.eventDate,
        effective_date: form.effectiveDate || form.eventDate,
        meeting_occurred: form.meetingOccurred,
        participants: form.participants || null,
        approvers: form.approvers || null,
        generated_content: { sections: output.sections },
        recommendation_reason: output.reason,
        facts_used: output.factsUsed,
        assumptions: output.assumptions,
        missing_information: output.missingInformation,
        risk_flags: output.riskFlags,
        professional_review_recommended: output.professionalReviewRecommended,
        template_version: output.templateVersion,
      });
      setSavedId(row.id);
      track("draft_saved", { record_type: output.recordType });
      setStep(4);
    } catch {
      toast.error("The draft could not be saved. Your answers have been preserved.");
    } finally {
      setSaving(false);
    }
  }

  if (business.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your business profile…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Create a business record</h1>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={`rounded-full border px-3 py-1 ${
                index === step
                  ? "border-primary bg-success-soft text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      {errors.length > 0 ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
            <p className="text-sm text-muted-foreground">
              Describe the meeting or business decision in your own words.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="speak">Speak</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="pt-4">
                <Label htmlFor="description" className="sr-only">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={7}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Example: On August 4, I decided to open a new business bank account for the company and authorized myself to manage deposits, payments and online banking."
                />
              </TabsContent>
              <TabsContent value="speak" className="pt-4">
                <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Voice input is not available yet in this beta. Use the Write tab for now.
                </p>
              </TabsContent>
            </Tabs>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Decision or meeting date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective date (optional)</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting">Did an actual meeting take place?</Label>
              <Select
                value={form.meetingOccurred}
                onValueChange={(v) => setForm({ ...form, meetingOccurred: v as typeof form.meetingOccurred })}
              >
                <SelectTrigger id="meeting">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="participants">Who participated?</Label>
                <Input
                  id="participants"
                  value={form.participants}
                  onChange={(e) => setForm({ ...form, participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvers">Who approved the decision?</Label>
                <Input
                  id="approvers"
                  value={form.approvers}
                  onChange={(e) => setForm({ ...form, approvers: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Optional notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" asChild>
                <Link href="/app">Save and exit</Link>
              </Button>
              <Button onClick={goDescribe}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 1 && business.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Confirm the business context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Legal business name</dt>
                <dd>{business.data.legal_name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">State of formation</dt>
                <dd>{business.data.state_of_formation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Entity type</dt>
                <dd>{business.data.entity_type}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ownership</dt>
                <dd>
                  {business.data.ownership_type === "single_member" ? "Single-member" : "Multi-member"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Management</dt>
                <dd>
                  {business.data.management_structure === "manager_managed"
                    ? "Manager-managed"
                    : "Member-managed"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Operating agreement</dt>
                <dd>{business.data.operating_agreement_status}</dd>
              </div>
            </dl>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/business-profile">Edit business profile</Link>
            </Button>

            <div className="space-y-2">
              <Label htmlFor="decidedBy">Who made or approved this decision?</Label>
              <Select
                value={answers.decidedBy ?? "member"}
                onValueChange={(v) => setAnswers({ ...answers, decidedBy: v })}
              >
                <SelectTrigger id="decidedBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">A member</SelectItem>
                  <SelectItem value="manager">A manager</SelectItem>
                  <SelectItem value="officer">An officer or authorized representative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {business.data.ownership_type === "multi_member" ? (
              <div className="space-y-2">
                <Label htmlFor="unanimous">Was the decision approved unanimously?</Label>
                <Select
                  value={answers.unanimous ?? "unsure"}
                  onValueChange={(v) => setAnswers({ ...answers, unanimous: v })}
                >
                  <SelectTrigger id="unanimous">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Does any of this apply?</legend>
              {RISK_QUESTIONS.map((q) => (
                <label key={q.key} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Checkbox
                    checked={answers[q.key] === true}
                    onCheckedChange={(v) => setAnswers({ ...answers, [q.key]: v === true })}
                  />
                  {q.label}
                </label>
              ))}
            </fieldset>

            {riskFlags.length > 0 ? (
              <div className="flex gap-3 rounded-lg border border-attention/40 bg-attention-soft p-4 text-sm text-attention-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Professional review recommended</p>
                  <p className="mt-1">
                    Matters like this often depend on your operating agreement and tax position. You
                    can still continue — the record will be flagged so you can involve an accountant
                    or lawyer.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  track("recommendation_viewed");
                  setStep(2);
                }}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 && business.data ? (
        <RecommendationStep
          business={business.data}
          form={form}
          answers={answers}
          override={override}
          setOverride={setOverride}
          onBack={() => setStep(1)}
          onGenerate={generate}
          generating={generating}
        />
      ) : null}

      {step === 3 && output ? (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{output.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{DISCLAIMER_SHORT}</p>
            </div>
            <Badge variant="outline" className="border-attention/50 bg-attention-soft text-attention-foreground">
              Draft for review
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-4">
                {output.sections.map((section, index) => (
                  <div key={section.id} className="space-y-1">
                    <Label htmlFor={`sec-${section.id}`} className="text-xs uppercase tracking-wide">
                      {section.heading}
                    </Label>
                    <Textarea
                      id={`sec-${section.id}`}
                      className="document-surface"
                      rows={Math.min(10, section.body.split("\n").length + 2)}
                      value={section.body}
                      onChange={(e) => {
                        const sections = [...output.sections];
                        sections[index] = { ...section, body: e.target.value };
                        setOutput({ ...output, sections });
                        track("draft_edited");
                      }}
                    />
                  </div>
                ))}
              </div>
              <ReviewPanel output={output} />
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save draft
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 4 && output ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
              Your business record has been saved.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Document name</dt>
                <dd>{output.title}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Record type</dt>
                <dd>{recordTypeLabel(output.recordType)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Business</dt>
                <dd>{business.data?.legal_name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date().toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>{output.professionalReviewRecommended ? "Professional review recommended" : "Draft"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Related event</dt>
                <dd className="line-clamp-2">{form.description}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              {savedId ? (
                <Button asChild>
                  <Link href={`/app/records/${savedId}`}>Open record</Link>
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => window.location.reload()}>
                Create another record
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/app">Return to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ReviewPanel({ output }: { output: GenerationOutput }) {
  const blocks: [string, string[]][] = [
    ["Facts used", output.factsUsed],
    ["Assumptions", output.assumptions],
    ["Missing information", output.missingInformation],
    ["Risk flags", output.riskFlags],
  ];
  return (
    <aside className="space-y-4 rounded-xl border border-border bg-surface p-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Document status</p>
        <p className="font-medium">Draft for review</p>
      </div>
      {blocks.map(([title, items]) => (
        <div key={title}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
          {items.length === 0 ? (
            <p className="text-muted-foreground">None identified.</p>
          ) : (
            <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Template version</p>
        <p className="text-muted-foreground">{output.templateVersion}</p>
      </div>
      {output.professionalReviewRecommended ? (
        <p className="rounded-lg bg-attention-soft p-3 text-attention-foreground">
          Professional review recommended.
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {PRODUCT_NAME} never invents attendees, votes, quorum or signatures. Anything missing is
        listed above.
      </p>
    </aside>
  );
}

function RecommendationStep({
  business,
  form,
  answers,
  override,
  setOverride,
  onBack,
  onGenerate,
  generating,
}: {
  business: NonNullable<ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchBusinessProfile>>>>["data"]>;
  form: {
    description: string;
    eventDate: string;
    effectiveDate: string;
    meetingOccurred: "yes" | "no" | "unsure";
    participants: string;
    approvers: string;
    notes: string;
  };
  answers: ContextAnswers;
  override: RecordType | "";
  setOverride: (v: RecordType | "") => void;
  onBack: () => void;
  onGenerate: () => void;
  generating: boolean;
}) {
  const [preview, setPreview] = useState<GenerationOutput | null>(null);

  useEffect(() => {
    if (!business) return;
    generateDraft({
      business,
      description: form.description,
      eventDate: form.eventDate,
      effectiveDate: form.effectiveDate || form.eventDate,
      meetingOccurred: form.meetingOccurred,
      participants: form.participants,
      approvers: form.approvers,
      notes: form.notes,
      answers,
    })
      .then(setPreview)
      .catch(() => setPreview(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!preview) {
    return <p className="text-sm text-muted-foreground">Reviewing your answers…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended business record</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-primary/30 bg-success-soft p-4">
          <p className="text-base font-semibold text-primary">{recordTypeLabel(preview.recordType)}</p>
          <p className="mt-2 text-sm text-foreground">{preview.reason}</p>
        </div>

        <ReviewPanel output={preview} />

        <div className="space-y-2">
          <Label htmlFor="override">Choose another record type (optional)</Label>
          <Select
            value={override || preview.recordType}
            onValueChange={(v) => {
              setOverride(v as RecordType);
              track("recommendation_changed", { record_type: v });
            }}
          >
            <SelectTrigger id="override">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECORD_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          This is a suggested starting format, not a legal determination.
        </p>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            Go back and edit answers
          </Button>
          <Button onClick={onGenerate} disabled={generating}>
            {generating ? <Loader2 className="size-4 animate-spin" /> : null}
            Generate draft
          </Button>
        </div>
        <p className="sr-only">{sectionsToPlainText(preview.sections).slice(0, 0)}</p>
      </CardContent>
    </Card>
  );
}
