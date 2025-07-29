import { router, useLocalSearchParams } from "expo-router";
import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  IntentionPayload,
  useTodaysIntentionStore,
} from "../store/todaysIntentionStore";

type IntentionFormContextValue = {
  payload: IntentionPayload;
  step: number;
  setIntention: (content: string) => void;
  setStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => Promise<void>;
};

type IntentionFormProviderProps = PropsWithChildren<{
  stepsLength: number;
}>;

const IntentionFormContext = createContext<
  IntentionFormContextValue | undefined
>(undefined);

export const IntentionFormProvider: FunctionComponent<
  IntentionFormProviderProps
> = ({ children, stepsLength }) => {
  const { t } = useTranslation();

  const { insertTodaysIntention, todaysIntention, updateTodaysIntention } =
    useTodaysIntentionStore();

  const [payload, setPayload] = useState<IntentionFormContextValue["payload"]>(
    todaysIntention || {
      intention: "",
    },
  );

  const [step, setStep] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const handleBack = async () => {
    setStep((prev) => {
      if (prev === 0) {
        router.back();
        return prev;
      }
      return prev - 1;
    });
  };

  const handleSave = async (payload: IntentionPayload) => {
    try {
      if (todaysIntention) {
        await updateTodaysIntention(payload);
      } else {
        await insertTodaysIntention(payload);
      }

      // After saving, redirect to success page
      router.replace("/intention/success");
    } catch (error) {
      console.error("Error saving intention:", error);
    }
  };

  const handleNext = async () => {
    setStep((prev) => {
      const nextStep = prev + 1;

      if (!payload.intention && nextStep > 1) {
        return prev;
      }

      if (nextStep >= stepsLength) {
        handleSave(payload);
        return prev;
      }

      return nextStep;
    });
  };

  const setIntention = (intention: string) => {
    setPayload((prev) => ({
      ...prev,
      intention,
    }));
  };

  return (
    <IntentionFormContext.Provider
      value={{
        payload,
        step,
        setIntention,
        setStep,
        handleBack,
        handleNext,
      }}
    >
      {children}
    </IntentionFormContext.Provider>
  );
};

export const useIntentionFormContext = () => {
  const context = useContext(IntentionFormContext);

  if (!context) {
    throw new Error(
      "useIntentionFormContext must be used within a IntentionFormProvider",
    );
  }

  return context;
};
