import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import twColors from "tailwindcss/colors";
import {
  MoodLogFormProvider,
  useMoodLogFormContext,
} from "../components/MoodLogFormProvider";
import { moodTypes, moodTypesList } from "../moodTypes";

function MoodLogFormScreenMoodPicker() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { moodType: selectedMoodType, setMoodType } = useMoodLogFormContext();

  return (
    <View className="flex-1 gap-6 p-6">
      <View className="gap-1">
        <Text className="text-text text-3xl font-semibold">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenMoodPicker.title",
          )}
        </Text>
        <Text className="text-text/50 text-base font-normal">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenMoodPicker.description",
          )}
        </Text>
      </View>
      <View className="flex-1 justify-center gap-4">
        {moodTypesList.map((moodType) => (
          <InteractivePressable
            key={moodType}
            onPress={() => setMoodType(moodType)}
          >
            <View className="flex-row items-center gap-6">
              <View
                className={`bg-card h-14 w-14 items-center justify-center rounded-2xl border-2`}
                style={{
                  borderColor:
                    twColors[moodTypes[moodType].color.token][
                      moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                    ],
                }}
              >
                <Text style={{ fontSize: 24 }}>{moodTypes[moodType].icon}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-text text-xl font-semibold"
                    style={{
                      color:
                        twColors[moodTypes[moodType].color.token][
                          moodTypes[moodType].color[
                            theme.dark ? "dark" : "light"
                          ]
                        ],
                    }}
                  >
                    {t(`features.moodLog.moodTypes.${moodType}.title`)}
                  </Text>
                  <IconSymbol
                    color={
                      twColors[moodTypes[moodType].color.token][
                        moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                      ]
                    }
                    name={
                      moodType === selectedMoodType
                        ? "checkmark.circle.fill"
                        : "circle"
                    }
                    size={24}
                  />
                </View>
                <Text className="text-text/50 text-base font-normal">
                  {t(`features.moodLog.moodTypes.${moodType}.description`)}
                </Text>
              </View>
            </View>
          </InteractivePressable>
        ))}
      </View>
    </View>
  );
}

function MoodLogFormScreenFeelingsPicker() {
  const { t } = useTranslation();

  const { feelings, moodType, toggleFeeling } = useMoodLogFormContext();

  if (!moodType) {
    return null;
  }

  return (
    <View className="flex-1 gap-6 p-6">
      <View className="gap-1">
        <Text className="text-text text-3xl font-semibold">
          {t(`features.moodLog.moodTypes.${moodType}.messageTitle`)}
        </Text>
        <Text className="text-text/50 text-base font-normal">
          {t(`features.moodLog.moodTypes.${moodType}.messageBody`)}
        </Text>
      </View>
      <View className="flex-1 flex-row flex-wrap items-center gap-4">
        {moodTypes[moodType].feelings.map((feeling) => {
          const isSelected = feelings.includes(feeling);

          return (
            <InteractivePressable
              key={feeling}
              className={`h-10 flex-row items-center justify-between gap-4 rounded-2xl px-4 ${isSelected ? "bg-primary" : "bg-background dark:bg-card"}`}
              onPress={() => toggleFeeling(feeling)}
            >
              <Text
                className={`text-base font-normal ${isSelected ? "text-white" : "text-text"}`}
              >
                {t(
                  `features.moodLog.moodTypes.${moodType}.feelings.${feeling}`,
                )}
              </Text>
            </InteractivePressable>
          );
        })}
      </View>
    </View>
  );
}

function MoodLogFormScreenNote() {
  const { t } = useTranslation();

  const { note, setNote } = useMoodLogFormContext();

  const refDebounce = useRef<number>(null);

  const refScrollView = useRef<ScrollView>(null);

  const handleOnChangeText = (value: string) => {
    if (refDebounce.current) {
      clearTimeout(refDebounce.current);
    }

    refDebounce.current = setTimeout(() => {
      setNote(value);
    }, 300);
  };

  return (
    <ScrollView
      contentContainerClassName="gap-6 p-6"
      onContentSizeChange={() =>
        refScrollView.current?.scrollToEnd({ animated: true })
      }
      ref={refScrollView}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-1">
        <Text className="text-text text-3xl font-semibold">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenNote.title",
          )}
        </Text>
        <Text className="text-text/50 text-base font-normal">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenNote.description",
          )}
        </Text>
      </View>
      <View className="flex-1">
        <TextInput
          autoFocus
          className="text-text text-lg font-normal"
          defaultValue={note}
          multiline
          onChangeText={handleOnChangeText}
          onFocus={() =>
            setTimeout(() => {
              refScrollView.current?.scrollToEnd({ animated: true });
            }, 500)
          }
          placeholder={t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenNote.inputPlaceholder",
          )}
        />
      </View>
    </ScrollView>
  );
}

export function MoodLogFormScreen() {
  const { t } = useTranslation();

  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useTheme();

  const [step, setStep] = useState(0);

  return (
    <MoodLogFormProvider>
      <View className="flex-1">
        <View className="pt-safe bg-card">
          <View className="border-b-hairline border-border h-16 flex-row items-center justify-start px-6">
            <InteractivePressable onPress={router.back} hitSlop={10}>
              <IconSymbol
                color={theme.colors.primary}
                name="chevron.left"
                size={24}
              />
            </InteractivePressable>
          </View>
        </View>
        <KeyboardAvoidingView behavior={"padding"} className="flex-1">
          <View className="flex-1">
            {step === 0 && <MoodLogFormScreenMoodPicker />}
            {step === 1 && <MoodLogFormScreenFeelingsPicker />}
            {step === 2 && <MoodLogFormScreenNote />}
          </View>
          <View className="border-border border-t-hairline bg-card p-6">
            <Button
              className="self-center"
              label={t("common.next")}
              onPress={() => setStep((prev) => prev + 1)}
            />
          </View>
        </KeyboardAvoidingView>
        <View className="pb-safe bg-card" />
      </View>
    </MoodLogFormProvider>
  );
}
