import { StepWrapper } from "@/components/builder/step-wrapper";
import { WizardFormContent } from "@/components/builder/wizard-form";

export default async function BuilderStepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { step } = await params;

  return (
    <StepWrapper>
      <WizardFormContent step={step} />
    </StepWrapper>
  );
}
