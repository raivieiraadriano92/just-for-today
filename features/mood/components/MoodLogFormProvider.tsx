import { router } from "expo-router";
import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { MoodLogPayload, MoodType } from "../store/moodLogStore";

type MoodLogFormContextValue = {
  moodType: MoodType | null;
  feelings: string[];
  note: string;
  setMoodType: (moodType: MoodType) => void;
  toggleFeeling: (feeling: string) => void;
  setNote: (note: string) => void;
  handleOnSave: () => Promise<void>;
  handleOnDelete: () => Promise<void>;
};

type MoodLogFormProviderProps = PropsWithChildren<{
  initialValues?: MoodLogPayload;
  onDelete?: () => void;
  onSave?: (payload: MoodLogPayload) => void;
}>;

const MoodLogFormContext = createContext<MoodLogFormContextValue | undefined>(
  undefined,
);

export const MoodLogFormProvider: FunctionComponent<
  MoodLogFormProviderProps
> = ({ children, initialValues, onDelete, onSave }) => {
  const { t } = useTranslation();

  const [moodType, setMoodType] = useState<MoodType | null>(
    initialValues?.mood ?? null,
  );

  const [feelings, setFeelings] = useState<string[]>(
    initialValues?.feelings ?? [],
  );

  const [note, setNote] = useState(initialValues?.note ?? "");

  const toggleFeeling = (feeling: string) => {
    setFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling],
    );
  };

  const handleOnSave = async () => {
    try {
      if (!moodType) {
        return;
      }

      const payload: MoodLogPayload = {
        feelings,
        mood: moodType,
        note,
        datetime: initialValues?.datetime ?? new Date().toISOString(),
      };

      await onSave?.(payload);

      router.replace("/mood/success");
    } catch (error) {
      console.error("Error saving mood:", error);
      // Optionally, you can show an error message to the user
    }
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
              await onDelete?.();

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

  const handleSetMoodType = (moodType: MoodType) => {
    setMoodType(moodType);
    setFeelings([]); // Reset feelings when mood type changes
  };

  return (
    <MoodLogFormContext.Provider
      value={{
        moodType,
        feelings,
        note,
        setMoodType: handleSetMoodType,
        toggleFeeling,
        setNote,
        handleOnSave,
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
