"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { FormDefinition } from "@/lib/schema";
import { track } from "@/lib/track";

type ContactFormProps = {
  formDef: FormDefinition;
  source: string;
  onSuccess?: () => void;
};

type FieldValue = string | boolean | string[];
type FormValues = Record<string, FieldValue>;

function initialValues(formDef: FormDefinition): FormValues {
  const values: FormValues = {};
  for (const field of formDef.fields) {
    if (!field.enabled) continue;
    if (field.type === "checkbox") values[field.name] = false;
    else if (field.type === "checkbox-group") values[field.name] = [];
    else values[field.name] = "";
  }
  return values;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function isValidPhone(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, "");
  return /^0\d{8,10}$/.test(digits);
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export function ContactForm({ formDef, source, onSuccess }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(formDef));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const enabledFields = formDef.fields.filter((field) => field.enabled);

  function setValue(name: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function toggleCheckboxGroup(name: string, option: string) {
    setValues((prev) => {
      const current = (prev[name] as string[] | undefined) ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [name]: next };
    });
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of enabledFields) {
      const value = values[field.name];
      if (field.type === "tel" && typeof value === "string" && value && !isValidPhone(value)) {
        nextErrors[field.name] = "연락처 형식을 확인해주세요.";
        continue;
      }
      if (!field.required) continue;
      if (field.type === "checkbox" && value !== true) {
        nextErrors[field.name] = "필수 동의 항목입니다.";
      } else if (field.type === "checkbox-group" && Array.isArray(value) && value.length === 0) {
        nextErrors[field.name] = "하나 이상 선택해주세요.";
      } else if (typeof value === "string" && value.trim() === "") {
        nextErrors[field.name] = "필수 입력 항목입니다.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (new FormData(form).get("website") as string | null) ?? "";
    if (honeypot) return;

    if (!validate()) return;

    setStatus("submitting");
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          honeypot,
          source,
          utm: getUtmParams(),
          referrer: typeof document !== "undefined" ? document.referrer : "",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setServerError(body?.message ?? "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setStatus("error");
        return;
      }

      setStatus("success");
      track("generate_lead", { source });
      onSuccess?.();
    } catch {
      setServerError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-border bg-background p-4 text-sm text-text">
        {formDef.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${source}-website`}>웹사이트</label>
        <input
          id={`${source}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {enabledFields.map((field) => {
        const error = errors[field.name];
        const fieldId = `${source}-${field.name}`;

        if (field.type === "checkbox") {
          return (
            <div key={field.name}>
              <label htmlFor={fieldId} className="flex items-start gap-2 text-sm text-text">
                <input
                  id={fieldId}
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0"
                  checked={values[field.name] === true}
                  onChange={(event) => setValue(field.name, event.target.checked)}
                />
                <span>
                  {field.label}
                  {field.required ? <span className="text-error"> *</span> : null}
                  {field.name === "agreePrivacy" ? (
                    <span className="block text-xs text-text-muted">{formDef.privacyText}</span>
                  ) : null}
                </span>
              </label>
              {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
            </div>
          );
        }

        if (field.type === "checkbox-group") {
          return (
            <div key={field.name}>
              <span className="mb-2 block text-sm font-medium text-text">
                {field.label}
                {field.required ? <span className="text-error"> *</span> : null}
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center gap-1.5 text-sm text-text">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={((values[field.name] as string[] | undefined) ?? []).includes(option)}
                      onChange={() => toggleCheckboxGroup(field.name, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-text">
                {field.label}
                {field.required ? <span className="text-error"> *</span> : null}
              </label>
              <select
                id={fieldId}
                className="min-h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-text"
                value={values[field.name] as string}
                onChange={(event) => setValue(field.name, event.target.value)}
              >
                <option value="">선택해주세요</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name}>
              <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-text">
                {field.label}
                {field.required ? <span className="text-error"> *</span> : null}
              </label>
              <textarea
                id={fieldId}
                rows={4}
                maxLength={field.maxLength}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-text"
                value={values[field.name] as string}
                onChange={(event) => setValue(field.name, event.target.value)}
              />
              {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-text">
              {field.label}
              {field.required ? <span className="text-error"> *</span> : null}
            </label>
            <input
              id={fieldId}
              type={field.type}
              inputMode={field.type === "tel" ? "numeric" : undefined}
              className="min-h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-text"
              value={values[field.name] as string}
              onChange={(event) =>
                setValue(
                  field.name,
                  field.type === "tel" ? formatPhone(event.target.value) : event.target.value,
                )
              }
            />
            {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
          </div>
        );
      })}

      {serverError ? <p className="text-sm text-error">{serverError}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 flex min-h-11 items-center justify-center rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {status === "submitting" ? "제출 중..." : "상담 신청하기"}
      </button>
    </form>
  );
}
