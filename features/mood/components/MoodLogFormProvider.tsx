import { drizzleDb } from "@/db/client";
import { moodLogsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import {
  MoodLogPayload,
  MoodType,
  useMoodLogStore,
} from "../store/moodLogStore";

type MoodLogFormContextValue = {
  payload: Omit<MoodLogPayload, "mood"> & Partial<Pick<MoodLogPayload, "mood">>;
  step: number;
  setStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => Promise<void>;
  setMoodType: (moodType: MoodType) => void;
  toggleFeeling: (feeling: string) => void;
  setNote: (note: string) => void;
  handleOnDelete: () => Promise<void>;
};

type MoodLogFormProviderProps = PropsWithChildren<{
  stepsLength: number;
}>;

const MoodLogFormContext = createContext<MoodLogFormContextValue | undefined>(
  undefined,
);

export const MoodLogFormProvider: FunctionComponent<
  MoodLogFormProviderProps
> = ({ children, stepsLength }) => {
  const { t } = useTranslation();

  const [payload, setPayload] = useState<MoodLogFormContextValue["payload"]>({
    datetime: new Date().toISOString(),
    feelings: [],
    note: "",
  });

  const [step, setStep] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const { insert, updateById } = useMoodLogStore();

  const handleBack = async () => {
    setStep((prev) => {
      if (prev === 0) {
        router.back();
        return prev;
      }
      return prev - 1;
    });
  };

  const handleSave = async () => {
    if (id && id !== "new") {
      await updateById(id, payload as MoodLogPayload);
    } else {
      await insert(payload as MoodLogPayload);
    }

    // After saving, redirect to success page
    router.replace("/mood/success");
  };

  const handleNext = async () => {
    if (!payload.mood) {
      return;
    }

    setStep((prev) => {
      const nextStep = prev + 1;

      if (nextStep >= stepsLength) {
        handleSave();
        return prev;
      }

      return nextStep;
    });
  };

  const toggleFeeling = (feeling: string) => {
    setPayload((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter((f) => f !== feeling)
        : [...prev.feelings, feeling],
    }));
  };

  const handleOnDelete = async () => {
    Alert.alert(
      t("common.deleteConfirmation.title"),
      t("common.deleteConfirmation.message"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              // await onDelete?.();

              router.back();
            } catch (error) {
              console.error("Error saving mood:", error);
              // Optionally, you can show an error message to the user
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const setMoodType = (moodType: MoodType) => {
    setPayload((prev) => ({
      ...prev,
      mood: moodType,
      feelings: [], // Reset feelings when mood type changes
    }));
  };

  const setNote = (note: string) => {
    setPayload((prev) => ({
      ...prev,
      note,
    }));
  };

  useEffect(() => {
    const fetchRow = async () => {
      const rows = await drizzleDb
        .select()
        .from(moodLogsTable)
        .where(eq(moodLogsTable.id, id))
        .limit(1);

      if (rows.length > 0) {
        setPayload({
          ...rows[0],
          mood: rows[0].mood as MoodType,
          feelings: rows[0].feelings.split(",") ?? [],
        });
      } else {
        console.error("Mood Log not found");
      }
    };

    if (id && id !== "new") {
      fetchRow();
    }
  }, [id]);

  return (
    <MoodLogFormContext.Provider
      value={{
        payload,
        step,
        setStep,
        handleBack,
        handleNext,
        setMoodType,
        toggleFeeling,
        setNote,
        handleOnDelete,
      }}
    >
      {children}
    </MoodLogFormContext.Provider>
  );
};

export const useMoodLogFormContext = () => {
  const context = useContext(MoodLogFormContext);

  if (!context) {
    throw new Error(
      "useMoodLogFormContext must be used within a MoodLogFormProvider",
    );
  }

  return context;
};
