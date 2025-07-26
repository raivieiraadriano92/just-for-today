import { router } from "expo-router";
import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type OnboardingContextValue = {
  isCommitmentAccepted: boolean;
  step: number;
  setStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => Promise<void>;
};

type OnboardingProviderProps = PropsWithChildren<{
  stepsLength: number;
}>;

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined,
);

export const OnboardingProvider: FunctionComponent<OnboardingProviderProps> = ({
  children,
  stepsLength,
}) => {
  const [step, setStep] = useState(0);
  const [isCommitmentAccepted, setIsCommitmentAccepted] = useState(false);

  const handleBack = async () => {
    setStep((prev) => {
      if (prev === 0) {
        router.back();
        return prev;
      }
      return prev - 1;
    });
  };

  const handleNext = async () => {
    setStep((prev) => {
      const nextStep = prev + 1;

      if (nextStep >= stepsLength) {
        router.replace("/onboarding/success");
        return prev;
      }

      return nextStep;
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        isCommitmentAccepted,
        step,
        setStep,
        handleBack,
        handleNext,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within a OnboardingProvider",
    );
  }

  return context;
};
