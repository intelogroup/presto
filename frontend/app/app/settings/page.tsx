"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock user data — replace with WorkOS auth when ready
const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex@example.com",
  initials: "AJ",
  plan: "free" as const,
  projectsUsed: 3,
  projectsLimit: 5,
};

export default function SettingsPage() {
  const [name, setName] = useState(MOCK_USER.name);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
    };
  }, []);

  function handleSave() {
    setSaved(true);
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
    }
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  const usagePercent = Math.round(
    (MOCK_USER.projectsUsed / MOCK_USER.projectsLimit) * 100
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Plan & Billing</TabsTrigger>
        </TabsList>

        {/* ─── Profile Tab ─── */}
        <TabsContent value="profile" className="space-y-8">
          {/* Avatar + name */}
          <section className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary ring-1 ring-primary/20">
                {MOCK_USER.initials}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{MOCK_USER.name}</p>
                <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg" disabled>
                Change photo
              </Button>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={MOCK_USER.email}
                  disabled
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="rounded-xl shadow-sm shadow-primary/20"
                onClick={handleSave}
                disabled={name === MOCK_USER.name}
              >
                {saved ? (
                  <>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="mr-1.5 size-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              {name !== MOCK_USER.name && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setName(MOCK_USER.name)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            <div className="space-y-3">
              <NotificationRow
                label="Project completed"
                description="Get notified when a presentation finishes rendering"
                defaultChecked
              />
              <NotificationRow
                label="Processing failed"
                description="Alert when a project fails to process"
                defaultChecked
              />
              <NotificationRow
                label="Product updates"
                description="New features and improvements"
                defaultChecked={false}
              />
            </div>
          </section>

          {/* Danger zone */}
          <section className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" size="sm" className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10" disabled>
              Delete account
            </Button>
          </section>
        </TabsContent>

        {/* ─── Plan & Billing Tab ─── */}
        <TabsContent value="billing" className="space-y-8">
          {/* Current plan */}
          <section className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Current plan</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    Free
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {MOCK_USER.projectsLimit} presentations / month
                  </span>
                </div>
              </div>
              <Link href="/#pricing" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 h-9 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors">
                Upgrade to Pro
              </Link>
            </div>

            <Separator />

            {/* Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly usage</span>
                <span className="font-medium text-foreground">
                  {MOCK_USER.projectsUsed} / {MOCK_USER.projectsLimit}
                </span>
              </div>
              <Progress value={usagePercent} />
              <p className="text-xs text-muted-foreground/60">
                Resets on the 1st of each month
              </p>
            </div>
          </section>

          {/* Plan comparison */}
          <section className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Plan comparison</h2>
            <div className="grid grid-cols-2 gap-4">
              <PlanColumn
                name="Free"
                price="$0"
                features={[
                  "5 presentations / month",
                  "720p export",
                  "Basic themes",
                  "Community support",
                ]}
                current
              />
              <PlanColumn
                name="Pro"
                price="$19"
                features={[
                  "Unlimited presentations",
                  "1080p + 4K export",
                  "All 17 themes",
                  "Priority support",
                  "Custom branding",
                  "API access",
                ]}
              />
            </div>
          </section>

          {/* Invoice history */}
          <section className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Invoice history</h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground mb-3">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No invoices yet</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Invoices will appear here after you upgrade to Pro.</p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Sub-components ── */

function NotificationRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-2 -mx-2 hover:bg-muted/30 transition-colors">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function PlanColumn({
  name,
  price,
  features,
  current,
}: {
  name: string;
  price: string;
  features: string[];
  current?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 space-y-3 ${
        current
          ? "border-primary/30 bg-primary/5"
          : "border-border/60"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{name}</span>
          {current && (
            <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-md px-1.5 py-0.5">
              Current
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground mt-1">
          {price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </div>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5 shrink-0 mt-0.5 text-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
