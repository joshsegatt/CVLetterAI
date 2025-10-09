'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { saveLetterDraft } from '@/features/letter-builder/api/client';
import {
  defaultLetterBuilderValues,
  letterBuilderSchema,
  type LetterBuilderForm
} from '@/features/letter-builder/schema';

const toneDescriptions: Record<LetterBuilderForm['tone'], string> = {
  formal: 'Structured legal tone citing tenancy clauses and clear obligations.',
  polite: 'Professional yet warm tone focused on collaboration and goodwill.',
  firm: 'Direct and assertive language for escalations or overdue notices.'
};

export function LetterBuilderShell() {
  const [preview, setPreview] = useState('');
  const [isSaving, startSaving] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const form = useForm<LetterBuilderForm>({
    resolver: zodResolver(letterBuilderSchema),
    defaultValues: defaultLetterBuilderValues
  });
  form.register('id');
  form.register('userId');

  const onGenerate = (values: LetterBuilderForm) => {
    const intro = `Dear ${values.recipientName},`;
    const body =
      values.tone === 'formal'
        ? `This correspondence serves as a formal reminder regarding ${values.context}.`
        : values.tone === 'polite'
          ? `I hope you are well. I am writing in relation to ${values.context}.`
          : `This is an urgent notification regarding ${values.context}.`;

    const legal = values.includeLegalReference
      ? '\n\nThis request is aligned with the Assured Shorthold Tenancy obligations set out under the Housing Act 1988 and current UK legislation.'
      : '';

    const closing =
      values.tone === 'firm'
        ? '\n\nPlease action the above within 7 days to avoid further escalation.'
        : '\n\nPlease let me know if you have any questions — I’m happy to support next steps.';

    setPreview(`${intro}\n\n${body}${legal}${closing}\n\nKind regards,\nCVLetterAI`);
  };

  const handleSaveDraft = () => {
    startSaving(async () => {
      setSaveStatus(null);
      setSaveError(null);

      try {
        const valid = await form.trigger(undefined, { shouldFocus: false });
        if (!valid) {
          setSaveStatus('error');
          setSaveError('Please resolve validation issues before saving.');
          return;
        }

        const values = letterBuilderSchema.parse({ ...form.getValues(), userId: 'demo-user' });
        const { id } = await saveLetterDraft(values);
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
      <form
        className="glass-panel border border-white/10 p-6"
        onSubmit={form.handleSubmit(onGenerate)}
      >
        <div className="space-y-4">
          <InputField label="Recipient" error={form.formState.errors.recipientName?.message}>
            <input
              {...form.register('recipientName')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </InputField>
          <InputField label="Property address" error={form.formState.errors.propertyAddress?.message}>
            <textarea
              {...form.register('propertyAddress')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </InputField>
          <InputField label="Context" error={form.formState.errors.context?.message}>
            <textarea
              {...form.register('context')}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </InputField>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-neutral-200">Tone presets</legend>
            <div className="flex flex-wrap gap-2">
              {(['formal', 'polite', 'firm'] as const).map((tone) => {
                const selected = form.watch('tone') === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => form.setValue('tone', tone)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition',
                      selected
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-white/10 text-neutral-300 hover:bg-white/5'
                    )}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-neutral-400">{toneDescriptions[form.watch('tone')]}</p>
          </fieldset>

          <label className="flex items-center gap-2 text-xs text-neutral-200">
            <input
              type="checkbox"
              {...form.register('includeLegalReference')}
              className="h-4 w-4 rounded border border-white/10 bg-white/5"
            />
            <span>Reference specific UK legislation</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Generate letter</Button>
        </div>
      </form>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel border border-white/10 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <Button type="button" intent="ghost" size="sm" onClick={() => onGenerate(form.getValues())}>
            Refresh
          </Button>
        </div>
        <pre className="mt-6 min-h-[280px] whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-neutral-100">
{preview || 'Generate a letter to see the AI-drafted output with compliance cues.'}
        </pre>
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
            <span className="text-xs text-accent">Letter saved to Neon.</span>
          ) : null}
          {saveStatus === 'error' ? (
            <span className="text-xs text-rose-300">
              {saveError ?? 'Unable to save letter. Try again.'}
            </span>
          ) : null}
        </div>
      </motion.section>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function InputField({ label, error, children }: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-neutral-200">
      <span className="font-medium text-neutral-200">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
