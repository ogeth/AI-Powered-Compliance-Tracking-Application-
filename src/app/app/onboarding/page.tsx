"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { fetchBusinessProfile, upsertBusinessProfile } from "@/lib/data";
import { track } from "@/lib/product";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    legal_name: "",
    trading_name: "",
    state_of_formation: "Colorado",
    entity_type: "LLC",
    ownership_type: "single_member",
    management_structure: "member_managed",
    user_role: "sole_member",
    member_count: 1,
    operating_agreement_status: "unsure",
    business_address: "",
    formation_date: "",
  });

  useEffect(() => {
    track("onboarding_started");
    fetchBusinessProfile().then((existing) => {
      if (existing) {
        setValues((v) => ({
          ...v,
          ...existing,
          trading_name: existing.trading_name ?? "",
          business_address: existing.business_address ?? "",
          formation_date: existing.formation_date ?? "",
        }));
      }
    });
  }, []);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function finish() {
    if (!values.legal_name.trim()) {
      toast.error("Enter your legal business name so records can be prepared correctly.");
      setStep(1);
      return;
    }
    setSaving(true);
    try {
      await upsertBusinessProfile({
        ...values,
        member_count: Number(values.member_count) || 1,
        formation_date: values.formation_date || null,
        trading_name: values.trading_name || null,
        business_address: values.business_address || null,
        onboarding_completed: true,
      });
      track("onboarding_completed");
      router.push("/app/records/new");
    } catch {
      toast.error("We could not save your business profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-medium text-muted-foreground">Step {step} of 3</p>
      <Progress value={(step / 3) * 100} className="mt-3" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {step === 1
              ? "Business identity"
              : step === 2
                ? "Ownership and management"
                : "Governing documents"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="legal_name">Legal business name</Label>
                <Input
                  id="legal_name"
                  value={values.legal_name}
                  onChange={(e) => set("legal_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trading_name">Trading name (optional)</Label>
                <Input
                  id="trading_name"
                  value={values.trading_name}
                  onChange={(e) => set("trading_name", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State of formation</Label>
                  <Input
                    id="state"
                    value={values.state_of_formation}
                    onChange={(e) => set("state_of_formation", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type">Entity type</Label>
                  <Select value={values.entity_type} onValueChange={(v) => set("entity_type", v)}>
                    <SelectTrigger id="entity_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="Sole proprietorship">Sole proprietorship</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="rounded-lg border border-border bg-surface p-3 text-sm text-muted-foreground">
                The current document recommendations are optimized for LLCs.
              </p>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="ownership">Ownership</Label>
                <Select value={values.ownership_type} onValueChange={(v) => set("ownership_type", v)}>
                  <SelectTrigger id="ownership">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_member">Single-member</SelectItem>
                    <SelectItem value="multi_member">Multi-member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {values.ownership_type === "multi_member" ? (
                <div className="space-y-2">
                  <Label htmlFor="member_count">Number of members</Label>
                  <Input
                    id="member_count"
                    type="number"
                    min={2}
                    value={values.member_count}
                    onChange={(e) => set("member_count", Number(e.target.value))}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="management">Management structure</Label>
                <Select
                  value={values.management_structure}
                  onValueChange={(v) => set("management_structure", v)}
                >
                  <SelectTrigger id="management">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member_managed">Member-managed</SelectItem>
                    <SelectItem value="manager_managed">Manager-managed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your role</Label>
                <Select value={values.user_role} onValueChange={(v) => set("user_role", v)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_member">Sole member</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="authorized_representative">
                      Authorized representative
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="oa">Do you have an operating agreement?</Label>
                <Select
                  value={values.operating_agreement_status}
                  onValueChange={(v) => set("operating_agreement_status", v)}
                >
                  <SelectTrigger id="oa">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload">Operating agreement upload (optional)</Label>
                <Input id="upload" type="file" disabled />
                <p className="text-xs text-muted-foreground">
                  You can upload governing documents from the Documents area after onboarding.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business address (optional)</Label>
                <Input
                  id="address"
                  value={values.business_address}
                  onChange={(e) => set("business_address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formation_date">Formation date (optional)</Label>
                <Input
                  id="formation_date"
                  type="date"
                  value={values.formation_date}
                  onChange={(e) => set("formation_date", e.target.value)}
                />
              </div>
            </>
          ) : null}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={finish} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Create my first record
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">You can edit all of this later.</p>
        </CardContent>
      </Card>
    </div>
  );
}
