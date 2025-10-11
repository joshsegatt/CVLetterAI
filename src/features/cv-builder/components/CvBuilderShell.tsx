/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { saveCvDraft } from '@/features/cv-builder/api/client';
import {
  cvBuilderSchema,
  defaultCvBuilderValues,
  type CvBuilderForm
} from '@/features/cv-builder/schema';

const steps = [
  {
    key: 'profile',
    title: 'Personal details',
    description: 'Baseline identity and contact details surfaced in the header.',
    fields: ['fullName', 'headline', 'location', 'email', 'phone'] as (keyof CvBuilderForm)[]
  },
  {
    key: 'summary',
    title: 'Professional summary',
    description: 'Your 3–4 sentence pitch optimised for ATS scanning.',
    fields: ['summary'] as (keyof CvBuilderForm)[]
  },
  {
    key: 'experience',
    title: 'Experience',
    description: 'Highlight recent roles, impact metrics, and UK context.',
    fields: ['experience'] as (keyof CvBuilderForm)[]
  },
  {
    key: 'skills',
    title: 'Skills',
    description: 'Structured capabilities and soft skills for scanning.',
    fields: ['skills'] as (keyof CvBuilderForm)[]
  }
];

export function CvBuilderShell() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<CvBuilderForm>({
    resolver: zodResolver(cvBuilderSchema),
    mode: 'onChange',
    defaultValues: defaultCvBuilderValues
  });
  form.register('id');
  form.register('userId');

  const currentStep = steps[activeStep];

  const preview = form.watch();

  const nextStep = () => {
    if (activeStep === steps.length - 1) {
      setCompleted(true);
    } else {
      setActiveStep((step) => step + 1);
    }
  };

  const handleNext = async (): Promise<void> => {
  // Safely trigger validation for current step fields
  const valid = await form.trigger([...currentStep.fields], {
    shouldFocus: true,
  });

  if (!valid) return;
  nextStep();
};

      shouldFocus: true
    });

    if (!valid) return;

    nextStep();
  };

  const handlePrevious = () => {
    setActiveStep((step) => Math.max(0, step - 1));
  };

  const addExperience = () => {
    const experience = form.getValues('experience');
    form.setValue('experience', [
      ...experience,
      {
        title: 'Role title',
        company: 'Company',
        summary: 'Describe impact and responsibilities.'
      }
    ]);
  };

  const addSkill = () => {
    const skills = form.getValues('skills');
    form.setValue('skills', [...skills, 'New skill']);
  };

  const handleSaveDraft = () => {
    startSaving(async () => {
      setSaveStatus(null);
      setSaveError(null);

      try {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const valid = await form.trigger(undefined, { shouldFocus: false });
        if (!valid) {
          setSaveStatus('error');
          setSaveError('Please resolve validation issues before saving.');
          return;
        }

        const values = cvBuilderSchema.parse({ ...form.getValues(), userId: 'demo-user' });
        const { id } = await saveCvDraft(values);
        form.setValue('id', id, { shouldDirty: false, shouldTouch: false });
        setSaveStatus('success');
      } catch (error) {
        setSaveStatus('error');
        setSaveError(error instanceof Error ? error.message : 'Unknown error');
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <aside className="glass-panel border border-white/10 p-6">
        <ol className="space-y-4">
          {steps.map((step, index) => {
            const status =
              index === activeStep ? 'active' : index < activeStep || completed ? 'done' : 'todo';
            return (
              <li key={step.key} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    status === 'active' && 'bg-accent text-white shadow-glow',
                    status === 'done' && 'bg-white/10 text-accent',
                    status === 'todo' && 'border border-white/10 text-neutral-500'
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-xs text-neutral-400">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="space-y-6">
        <motion.form
          key={currentStep.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass-panel border border-white/10 p-6"
        >
          {currentStep.key === 'profile' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={form.formState.errors.fullName?.message}>
                <input
                  {...form.register('fullName')}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </Field>
              <Field label="Professional headline" error={form.formState.errors.headline?.message}>
                <input
                  {...form.register('headline')}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </Field>
              <Field label="Location" error={form.formState.errors.location?.message}>
                <input
                  {...form.register('location')}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input
                  {...form.register('email')}
                  type="email"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <input
                  {...form.register('phone')}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
              </Field>
            </div>
          )}

          {currentStep.key === 'summary' && (
            <Field label="Professional summary" error={form.formState.errors.summary?.message}>
              <textarea
                {...form.register('summary')}
                className="min-h-[160px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              />
            </Field>
          )}

          {currentStep.key === 'experience' && (
            <div className="space-y-4">
              {form.watch('experience').map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Role"
                      error={form.formState.errors.experience?.[index]?.title?.message}
                    >
                      <input
                        {...form.register(`experience.${index}.title` as const)}
                        className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
                      />
                    </Field>
                    <Field
                      label="Company"
                      error={form.formState.errors.experience?.[index]?.company?.message}
                    >
                      <input
                        {...form.register(`experience.${index}.company` as const)}
                        className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
                      />
                    </Field>
                  </div>
                  <Field
                    label="Summary"
                    error={form.formState.errors.experience?.[index]?.summary?.message}
                  >
                    <textarea
                      {...form.register(`experience.${index}.summary` as const)}
                      className="mt-2 min-h-[100px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
                    />
                  </Field>
                </div>
              ))}
              <Button type="button" intent="ghost" size="sm" onClick={addExperience}>
                Add another role
              </Button>
            </div>
          )}

          {currentStep.key === 'skills' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {form.watch('skills').map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Button type="button" intent="ghost" size="sm" onClick={addSkill}>
                Add skill token
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button type="button" intent="ghost" size="sm" onClick={handlePrevious} disabled={activeStep === 0}>
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Generate preview' : 'Next step'}
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass-panel border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white">Live preview</h2>
          <p className="text-xs text-neutral-400">
            Rendered using our ATS-friendly layout. Download as PDF/Word in the final step.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-neutral-100">
            <header className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{preview.fullName}</h3>
              <p className="text-sm text-neutral-300">{preview.headline}</p>
              <p className="text-xs text-neutral-400">
                {preview.location} · {preview.email} · {preview.phone}
              </p>
            </header>
            <section className="mt-6 space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">
                Summary
              </h4>
              <p className="text-sm text-neutral-200">{preview.summary}</p>
            </section>
            <section className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">
                Experience
              </h4>
              {preview.experience.map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <p className="text-sm font-semibold text-white">
                    {item.title} · {item.company}
                  </p>
                  <p className="text-xs text-neutral-300">{item.summary}</p>
                </div>
              ))}
            </section>
            <section className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {preview.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            {completed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-accent"
              >
                Preview generated! Proceed to export to download PDF/Word and sync to Neon storage.
              </motion.div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                intent="secondary"
                size="sm"
                disabled={isSaving}
                onClick={handleSaveDraft}
              >
                {isSaving ? 'Saving…' : 'Save draft to Neon'}
              </Button>
              {saveStatus === 'success' ? (
                <span className="text-xs text-accent">Draft synced successfully.</span>
              ) : null}
              {saveStatus === 'error' ? (
                <span className="text-xs text-rose-300">
                  {saveError ?? 'Could not save draft. Try again.'}
                </span>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-neutral-200">
      <span className="font-medium text-neutral-200">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
