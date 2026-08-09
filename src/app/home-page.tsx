"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileSignature,
  FileText,
  Files,
  Layers,
  Lock,
  MapPinned,
  MessagesSquare,
  NotebookPen,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { DISCLAIMER_LONG, PRODUCT_NAME, track } from "@/lib/product";
import { toast } from "sonner";

function PrimaryCta({ location, className }: { location: string; className?: string }) {
  return (
    <Button
      asChild
      size="lg"
      className={className}
      onClick={() => track("homepage_primary_cta_clicked", { location })}
    >
      <Link href="/signup?intent=record">
        Create your first business record
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  id,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  id?: string;
}) {
  return (
    <div id={id} className="mx-auto max-w-3xl scroll-mt-28 text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      {copy ? <p className="mt-4 text-base text-muted-foreground sm:text-lg">{copy}</p> : null}
    </div>
  );
}

function DraftBadge() {
  return (
    <Badge
      variant="outline"
      className="border-attention/50 bg-attention-soft text-attention-foreground"
    >
      Draft for review
    </Badge>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/60 blur-2xl"
      />
      <Card className="overflow-hidden border-border/80 shadow-lift">
        <CardHeader className="gap-2 border-b border-border bg-surface/70 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Business</p>
              <p className="text-sm font-semibold">Northstar Design LLC</p>
            </div>
            <DraftBadge />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 py-5">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              What the owner wrote
            </p>
            <p className="mt-2 text-sm text-foreground">
              “I decided to open a new business bank account and authorized myself to manage it on
              behalf of the company.”
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Recommended record:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Sole-Member Written Consent
            </span>
          </div>

          <div className="document-surface rounded-xl border border-border p-5 text-[0.9rem]">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em]">
              Sole-Member Written Consent of Northstar Design LLC
            </p>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Date</dt>
                <dd>August 4, 2026</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Background</dt>
                <dd className="text-muted-foreground">
                  The company determined that a dedicated business bank account was needed to
                  separate company funds.
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Authorization
                </dt>
                <dd className="text-muted-foreground">
                  The sole member is authorized to open the account and manage deposits, payments and
                  online banking.
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Sole member</dt>
                <dd className="text-muted-foreground">Name: ____________ Signature: ____________</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Example preview</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/signup?intent=record">Review draft</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const TRUST_STRIP = [
  "Designed for busy business owners",
  "Clear record recommendations",
  "Editable before saving",
  "Private workspace",
];

const PROBLEM_CARDS = [
  {
    icon: NotebookPen,
    title: "What should I document?",
    copy: "Understand when a meaningful business decision may deserve a written company record.",
  },
  {
    icon: Layers,
    title: "What type of record fits?",
    copy: "Distinguish between meeting minutes, written consents, resolutions and general decision records.",
  },
  {
    icon: FileSignature,
    title: "How do I prepare it?",
    copy: "Answer straightforward questions and receive an organized draft that you can review, edit, sign and store.",
  },
];

const STEPS = [
  {
    title: "Describe what happened",
    copy: "Write or speak naturally. You do not need to know formal legal terminology.",
  },
  {
    title: "Confirm the business context",
    copy: "Review the company structure, participants, decision date and approval details.",
  },
  {
    title: "Review and save the draft",
    copy: "Edit the generated record, export it, and store the completed version in your workspace.",
  },
];

const RECORD_CARDS = [
  {
    title: "Meeting Minutes",
    copy: "For documenting an actual meeting, participants, discussion and decisions.",
  },
  {
    title: "Sole-Member Written Consent",
    copy: "For recording a decision approved by the only member of an LLC without holding a formal meeting.",
  },
  {
    title: "Member Written Consent",
    copy: "For decisions approved in writing by multiple LLC members.",
  },
  {
    title: "Manager Resolution",
    copy: "For decisions made by an authorized manager in a manager-managed LLC.",
  },
  {
    title: "Business Decision Record",
    copy: "For maintaining a clear internal record when a more formal document type is not appropriate or cannot yet be determined.",
  },
];

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "AI Business Record Generator",
    copy: "Turn descriptions of meetings and important decisions into structured, editable drafts.",
    badge: "Available in beta",
  },
  {
    icon: Files,
    title: "Business Records Library",
    copy: "Organize drafts, signed records and supporting documents in one searchable workspace.",
    badge: "Available in beta",
  },
  {
    icon: MapPinned,
    title: "Personalized Compliance Map",
    copy: "See which supported obligations may apply based on the business structure, activities and location.",
    badge: "Coming soon",
  },
  {
    icon: CalendarClock,
    title: "Smart Compliance Calendar",
    copy: "Organize preparation dates, recurring obligations and important deadlines.",
    badge: "Coming soon",
  },
];

const PLATFORM_MODULES = [
  "Colorado Periodic Report tracking",
  "Federal estimated-tax readiness",
  "Colorado estimated-tax readiness",
  "Registered-agent information review",
  "Business-address change alerts",
  "Evidence Vault",
  "Accountant collaboration",
  "Professional-review requests",
];

const PRINCIPLES = [
  {
    icon: ScrollText,
    title: "Reviewable recommendations",
    copy: "See which record type was recommended and why.",
  },
  {
    icon: FileText,
    title: "Visible assumptions",
    copy: "Review the business facts and assumptions used to generate each draft.",
  },
  {
    icon: CheckCircle2,
    title: "Clear document status",
    copy: "Generated content is labelled as a draft until you review and complete it.",
  },
  {
    icon: MessagesSquare,
    title: "Professional escalation",
    copy: "Higher-risk matters are flagged when accountant or lawyer review may be appropriate.",
  },
];

const AUDIENCE = [
  "Freelancers",
  "Independent consultants",
  "Product and creative professionals",
  "Small agencies",
  "Solo service businesses",
  "Single-member LLC owners",
];

const FAQ = [
  {
    q: "Does every Colorado LLC need monthly meeting minutes?",
    a: `No. The appropriate records depend on the company, its operating agreement, management structure and the decisions being made. ${PRODUCT_NAME} does not assume that every LLC must hold or document monthly meetings.`,
  },
  {
    q: `Does ${PRODUCT_NAME} provide legal advice?`,
    a: `No. ${PRODUCT_NAME} helps organize information and prepare reviewable drafts. It does not provide legal representation or replace advice from a qualified professional.`,
  },
  {
    q: "What can I create during the beta?",
    a: "The beta supports meeting minutes, written consents, manager resolutions and general business decision records.",
  },
  {
    q: "Can I edit the generated document?",
    a: "Yes. Review and edit the content before saving, printing or exporting it.",
  },
  {
    q: "Will the product track other compliance requirements?",
    a: "Personalized obligations, Colorado Periodic Report tracking, calendar reminders and other compliance capabilities are planned for future releases.",
  },
  {
    q: "Is my information private?",
    a: "Your records are stored in your authenticated workspace. The product should clearly explain its security and data-handling practices in the Privacy and Security pages.",
  },
];

export function HomePage() {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  useEffect(() => {
    track("sample_demo_viewed", { surface: "homepage" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-accent/50 blur-3xl"
          />
          <div className="container-page relative py-20 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Colorado-first business records
              </p>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">
                Generate compliant LLC meeting minutes in 60 seconds
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Colorado freelancers &amp; small businesses — stay audit-ready without the legalese.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <PrimaryCta location="hero" />
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  onClick={() => track("homepage_secondary_cta_clicked", { location: "hero" })}
                >
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Start free. No credit card required.
              </p>

              <ul className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {[
                  "Built for owner-operated businesses",
                  "Structured, reviewable drafts",
                  "Secure record storage",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-b border-border bg-background">
          <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_STRIP.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="py-20">
          <div className="container-page">
            <SectionHeading
              title="Important decisions should not disappear into emails, notebooks or memory."
              copy="Small-business owners make consequential decisions every week, but those decisions are often never organized into a clear company record."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROBLEM_CARDS.map((card) => (
                <Card key={card.title} className="h-full border-border/80 shadow-soft">
                  <CardHeader>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <card.icon className="size-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="mt-3 text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Before / after */}
        <section className="border-y border-border bg-surface/70 py-20">
          <div className="container-page">
            <SectionHeading
              id="demo"
              title="Go from an ordinary note to an organized business record."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Card className="border-border/80 shadow-soft">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    What the owner says
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm leading-relaxed text-foreground">
                    This month I opened a new business bank account for Northstar Design LLC. I
                    approved the account and authorized myself to manage deposits, payments and online
                    banking.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-lift">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    What {PRODUCT_NAME} prepares
                  </p>
                  <DraftBadge />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium text-primary">Sole-Member Written Consent</p>
                  <dl className="document-surface space-y-3 rounded-xl border border-border p-5 text-sm">
                    {[
                      ["Company name", "Northstar Design LLC, a Colorado limited liability company"],
                      ["Decision date", "August 4, 2026"],
                      [
                        "Background",
                        "The company needed a dedicated bank account to keep company funds separate from personal funds.",
                      ],
                      [
                        "Resolution",
                        "The sole member approves opening a business bank account in the company's name.",
                      ],
                      [
                        "Authority granted",
                        "The sole member may manage deposits, payments and online banking for the account.",
                      ],
                      ["Effective date", "August 4, 2026"],
                      ["Signature block", "Name: ____________  Signature: ____________  Date: ______"],
                    ].map(([term, value]) => (
                      <div key={term}>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          {term}
                        </dt>
                        <dd className="text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 text-center">
              <Button
                asChild
                size="lg"
                onClick={() => track("homepage_primary_cta_clicked", { location: "demo" })}
              >
                <Link href="/signup?intent=record">Create a record from my notes</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="container-page">
            <SectionHeading id="how-it-works" title="Create a clear business record in three steps." />
            <ol className="relative mt-14 grid gap-8 md:grid-cols-3">
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block"
              />
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background text-base font-semibold text-primary shadow-soft">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Record type intelligence */}
        <section className="border-y border-border bg-surface/70 py-20">
          <div className="container-page">
            <SectionHeading
              id="record-types"
              title="Not every business decision should become meeting minutes."
              copy="The appropriate format depends on whether a meeting occurred, who approved the decision and how the company is managed."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {RECORD_CARDS.map((card) => (
                <Card key={card.title} className="h-full border-border/80 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-background p-5 text-center text-sm text-muted-foreground">
              {PRODUCT_NAME} recommends a starting format based on the information you provide. You
              remain responsible for reviewing the result.
            </p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20">
          <div className="container-page">
            <SectionHeading
              id="product"
              title="One workspace for business records today—and broader compliance clarity tomorrow."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {CAPABILITIES.map((card) => (
                <Card key={card.title} className="h-full border-border/80 shadow-soft">
                  <CardHeader className="flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <card.icon className="size-5" aria-hidden="true" />
                      </span>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                    <Badge
                      variant={card.badge === "Coming soon" ? "secondary" : "outline"}
                      className={
                        card.badge === "Coming soon"
                          ? ""
                          : "border-primary/40 bg-success-soft text-primary"
                      }
                    >
                      {card.badge}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform preview */}
        <section className="border-y border-border bg-surface/70 py-20">
          <div className="container-page">
            <SectionHeading
              id="platform"
              title="Your future compliance workspace."
              copy="The initial beta focuses on business records. Additional Colorado-first compliance capabilities will be introduced progressively."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLATFORM_MODULES.map((module) => (
                <button
                  key={module}
                  type="button"
                  onClick={() => setComingSoon(module)}
                  className="rounded-xl border border-border bg-background p-5 text-left transition-shadow hover:shadow-soft"
                >
                  <Badge variant="secondary" className="mb-3">
                    Coming soon
                  </Badge>
                  <p className="text-sm font-medium text-foreground">{module}</p>
                  <p className="mt-2 text-xs text-muted-foreground">In development</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-20">
          <div className="container-page">
            <SectionHeading id="trust" title="Built for clarity, not false certainty." />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {PRINCIPLES.map((item) => (
                <Card key={item.title} className="border-border/80 shadow-soft">
                  <CardHeader className="flex-row items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-surface p-6">
              <p className="flex gap-3 text-sm text-muted-foreground">
                <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {DISCLAIMER_LONG}
              </p>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="border-y border-border bg-surface/70 py-20">
          <div className="container-page">
            <SectionHeading
              id="audience"
              title="Designed for busy owner-operated businesses."
              copy="Start with one business record and build a more organized company history over time."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCE.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-5"
                >
                  <Users className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container-page max-w-3xl">
            <SectionHeading id="faq" title="Frequently asked questions" />
            <Accordion type="single" collapsible className="mt-10">
              {FAQ.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-navy py-20 text-navy-foreground">
          <div className="container-page max-w-3xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Create a clearer record of your next important business decision.
            </h2>
            <p className="mt-4 text-base text-navy-foreground/80">
              Describe what happened, review the recommended format and save an organized draft in
              your business workspace.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryCta location="footer_cta" />
            </div>
            <p className="mt-3 text-sm text-navy-foreground/70">
              Free during beta. No credit card required.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />

      <Dialog open={comingSoon !== null} onOpenChange={(open) => !open && setComingSoon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{comingSoon}</DialogTitle>
            <DialogDescription>
              This module is in development and is not available yet. Nothing shown here reflects a
              determination about your business.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              track("coming_soon_interest_submitted", { module: comingSoon ?? "unknown" });
              toast.success("Thanks — we'll let you know when this is available.");
              setComingSoon(null);
            }}
          >
            Notify me when available
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
