import { drizzleDb } from "@/db/client";
import { gratitudeLogsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as FileSystem from "expo-file-system";
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
  GratitudeLogPayload,
  useGratitudeLogStore,
} from "../store/gratitudeStore";

type GratitudeLogFormContextValue = {
  payload: GratitudeLogPayload;
  step: number;
  setContent: (content: string) => void;
  setImages: (images: string[]) => void;
  setStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => Promise<void>;
  handleOnDelete: () => Promise<void>;
};

type GratitudeLogFormProviderProps = PropsWithChildren<{
  stepsLength: number;
}>;

const GratitudeLogFormContext = createContext<
  GratitudeLogFormContextValue | undefined
>(undefined);

export const GratitudeLogFormProvider: FunctionComponent<
  GratitudeLogFormProviderProps
> = ({ children, stepsLength }) => {
  const { t } = useTranslation();

  const [payload, setPayload] = useState<
    GratitudeLogFormContextValue["payload"]
  >({
    content: "",
    datetime: new Date().toISOString(),
    images: [],
  });

  const [step, setStep] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const { insert, updateById } = useGratitudeLogStore();

  const handleBack = async () => {
    setStep((prev) => {
      if (prev === 0) {
        router.back();
        return prev;
      }
      return prev - 1;
    });
  };

  const saveImages = async (images: string[]) => {
    const directoryBase = `${FileSystem.documentDirectory}gratitude`;

    const asset = images[0];
    const filename = asset.split("/").pop();
    const newPath = `${directoryBase}/${filename}`;

    await FileSystem.makeDirectoryAsync(`${directoryBase}`, {
      intermediates: true,
    });
    await FileSystem.copyAsync({ from: asset, to: newPath });

    // const files = await FileSystem.readDirectoryAsync(directoryBase);

    // console.log("Files in gratitude directory:", files);

    // Store `newPath` in SQLite via Drizzle
    return [newPath];
  };

  const handleSave = async (payload: GratitudeLogPayload) => {
    const images = await saveImages(payload.images);

    if (id && id !== "new") {
      updateById(id, { ...payload, images });
    } else {
      insert({ ...payload, images });
    }

    // After saving, redirect to success page
    router.replace("/gratitude/success");
  };

  const handleNext = async () => {
    if (!payload.content) {
      return;
    }

    setStep((prev) => {
      const nextStep = prev + 1;

      if (nextStep >= stepsLength) {
        handleSave(payload);
        return prev;
      }

      return nextStep;
    });
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
              console.error("Error saving gratitude:", error);
              // Optionally, you can show an error message to the user
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const setContent = (content: string) => {
    setPayload((prev) => ({
      ...prev,
      content,
    }));
  };

  const setImages = (images: string[]) => {
    setPayload((prev) => ({
      ...prev,
      images,
    }));
  };

  useEffect(() => {
    const fetchRow = async () => {
      const rows = await drizzleDb
        .select()
        .from(gratitudeLogsTable)
        .where(eq(gratitudeLogsTable.id, id))
        .limit(1);

      if (rows.length > 0) {
        setPayload({
          ...rows[0],
          images: rows[0].images.split(",").filter(Boolean),
        });
      } else {
        console.error("Gratitude Log not found");
      }
    };

    if (id && id !== "new") {
      fetchRow();
    }
  }, [id]);

  return (
    <GratitudeLogFormContext.Provider
      value={{
        payload,
        step,
        setContent,
        setImages,
        setStep,
        handleBack,
        handleNext,
        handleOnDelete,
      }}
    >
      {children}
    </GratitudeLogFormContext.Provider>
  );
};

export const useGratitudeLogFormContext = () => {
  const context = useContext(GratitudeLogFormContext);

  if (!context) {
    throw new Error(
      "useGratitudeLogFormContext must be used within a GratitudeLogFormProvider",
    );
  }

  return context;
};
