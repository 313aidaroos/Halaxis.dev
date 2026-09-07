"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waitlistSchema } from "@/lib/validations/waitlist";

type FormState = {
  fullName: string;
  email: string;
  organization: string;
  message: string;
  accreditedAttestation: boolean;
  understandNotOffer: boolean;
};

const initial: FormState = {
  fullName: "",
  email: "",
  organization: "",
  message: "",
  accreditedAttestation: false,
  understandNotOffer: false,
};

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: FormState) => {
      const parsed = waitlistSchema.safeParse({
        ...payload,
        accreditedAttestation: payload.accreditedAttestation ? true : undefined,
        understandNotOffer: payload.understandNotOffer ? true : undefined,
      });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid form.");
      }
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to submit interest.");
      }
      return data;
    },
    onSuccess: () => {
      setForm(initial);
      setFieldError(null);
    },
    onError: (error) => {
      setFieldError(error instanceof Error ? error.message : "Submission failed.");
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(form);
      }}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">Organization (optional)</Label>
        <Input
          id="organization"
          name="organization"
          autoComplete="organization"
          value={form.organization}
          onChange={(event) =>
            setForm((current) => ({ ...current, organization: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Note (optional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How you learned about Halaxis, or a general question. Do not include account or wire instructions."
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
        />
      </div>
      <div className="space-y-3 rounded-lg border border-border p-4">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <Checkbox
            checked={form.accreditedAttestation}
            onCheckedChange={(value) =>
              setForm((current) => ({
                ...current,
                accreditedAttestation: value === true,
              }))
            }
            className="mt-0.5"
          />
          <span>
            I attest that I am an accredited investor (or the equivalent under
            the laws of my jurisdiction), or I am inquiring solely as a
            professional adviser on behalf of such a person. This is not a
            subscription.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <Checkbox
            checked={form.understandNotOffer}
            onCheckedChange={(value) =>
              setForm((current) => ({
                ...current,
                understandNotOffer: value === true,
              }))
            }
            className="mt-0.5"
          />
          <span>
            I understand this form is an expression of interest only — not an
            offer of securities, not investment advice, and not an acceptance of
            funds.
          </span>
        </label>
      </div>
      {fieldError || mutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {fieldError}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="text-sm text-primary" role="status">
          Thank you. We recorded your interest and will contact you only if and
          when a lawful path to communicate further exists.
        </p>
      ) : null}
      <Button type="submit" variant="gold" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting…" : "Submit interest"}
      </Button>
    </form>
  );
}
