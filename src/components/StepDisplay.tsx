import { Fragment, type ReactNode } from "react";
import "./StepDisplay.css";
import { Stage } from "../types/stage";

type Step = {
  name: string;
  label: string;
  icon: ReactNode;
};
type StepDisplayProps = {
  steps: readonly Step[];
  currentStepIndex: number;
  onStepSelect: (stepIndex: number) => void;
};

function StepDisplay({
  steps,
  currentStepIndex,
  onStepSelect,
}: StepDisplayProps) {
  return (
    <div className="step-display">
      {steps.map((step, index) => {
        const isCurrent = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        const contents = (
          <>
            <span className="bead__icon" aria-hidden="true">
              {step.icon}
            </span>
            <span
              className={isCurrent ? "bead__label" : "visually-hidden"}
              aria-hidden="true"
            >
              {step.label}
            </span>
          </>
        );

        return (
          <Fragment key={step.name}>
            {index > 0 && (
              <div
                className={`bead-connector ${index <= currentStepIndex ? "bead-connector--done" : ""}`}
              />
            )}

            {isCompleted ? (
              <button
                type="button"
                className="bead bead--done bead--clickable"
                aria-label={`Go back to ${step.label}`}
                onClick={() => onStepSelect(index)}
              >
                {contents}
              </button>
            ) : (
              <div
                className={`bead ${isCurrent ? "bead--current" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {contents}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export default StepDisplay;
