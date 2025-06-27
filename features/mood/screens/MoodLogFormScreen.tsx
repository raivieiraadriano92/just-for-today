import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { createRef, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, { LinearTransition } from "react-native-reanimated";
import twColors from "tailwindcss/colors";
import {
  MoodLogFormProvider,
  useMoodLogFormContext,
} from "../components/MoodLogFormProvider";
import { moodTypes, moodTypesList } from "../moodTypes";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function MoodLogFormScreenMoodPicker() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { payload, setMoodType } = useMoodLogFormContext();

  return (
    <ScrollView
      contentContainerClassName="gap-12 p-6 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenMoodPicker.title",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenMoodPicker.description",
          )}
        </Text>
      </View>
      <View className="flex-1 gap-4">
        {moodTypesList.map((moodType) => {
          const isSelected = payload.mood === moodType;

          return (
            <InteractivePressable
              key={moodType}
              onPress={() => setMoodType(moodType)}
            >
              <View className="flex-row items-center gap-6">
                <View
                  className={`h-14 w-14 items-center justify-center rounded-2xl border-2 bg-card`}
                  style={{
                    borderColor:
                      twColors[moodTypes[moodType].color.token][
                        moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                      ],
                    backgroundColor: isSelected
                      ? twColors[moodTypes[moodType].color.token][
                          moodTypes[moodType].color[
                            theme.dark ? "dark" : "light"
                          ]
                        ]
                      : "transparent",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>
                    {moodTypes[moodType].icon}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-xl font-semibold text-text"
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
                    <Ionicons
                      color={
                        twColors[moodTypes[moodType].color.token][
                          moodTypes[moodType].color[
                            theme.dark ? "dark" : "light"
                          ]
                        ]
                      }
                      name={
                        isSelected ? "checkmark-circle" : "radio-button-off"
                      }
                      size={24}
                    />
                  </View>
                  <Text className="text-base font-normal text-text/50">
                    {t(`features.moodLog.moodTypes.${moodType}.description`)}
                  </Text>
                </View>
              </View>
            </InteractivePressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function MoodLogFormScreenFeelingsPicker() {
  const { t } = useTranslation();

  const { payload, toggleFeeling } = useMoodLogFormContext();

  return (
    <ScrollView
      contentContainerClassName="gap-12 p-6 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(`features.moodLog.moodTypes.${payload.mood}.messageTitle`)}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(`features.moodLog.moodTypes.${payload.mood}.messageBody`)}
        </Text>
        <Text className="mt-3 text-xl font-semibold text-text">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenFeelingsPicker.title",
          )}
        </Text>
      </View>
      <View className="flex-row flex-wrap items-center gap-4">
        {(payload.mood ? moodTypes[payload.mood].feelings : []).map(
          (feeling) => {
            const isSelected = payload.feelings.includes(feeling);

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
                    `features.moodLog.moodTypes.${payload.mood}.feelings.${feeling}`,
                  )}
                </Text>
              </InteractivePressable>
            );
          },
        )}
      </View>
    </ScrollView>
  );
}

function MoodLogFormScreenNote() {
  const { t } = useTranslation();

  const { payload, setNote } = useMoodLogFormContext();

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
      contentContainerClassName="gap-12 p-6 pt-12"
      onContentSizeChange={() =>
        refScrollView.current?.scrollToEnd({ animated: true })
      }
      ref={refScrollView}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenNote.title",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.moodLog.screens.MoodLogFormScreen.MoodLogFormScreenNote.description",
          )}
        </Text>
      </View>
      <View className="flex-1">
        <TextInput
          className="text-lg font-normal text-text"
          defaultValue={payload.note}
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

const steps = [
  MoodLogFormScreenMoodPicker,
  MoodLogFormScreenFeelingsPicker,
  MoodLogFormScreenNote,
];

const pagerViewRef = createRef<PagerView>();

function MoodLogFormScreenStepComponent() {
  const { payload, setStep, step } = useMoodLogFormContext();

  useEffect(() => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(step);
    }
  }, [step]);

  return (
    <PagerView
      initialPage={0}
      onPageSelected={(e) => setStep(e.nativeEvent.position)}
      orientation="horizontal"
      ref={pagerViewRef}
      scrollEnabled={!!payload.mood}
      style={{ flex: 1 }}
    >
      {steps.map((Step, index) => (
        <View key={index} className="flex-1">
          <Step />
        </View>
      ))}
    </PagerView>
  );
}

function MoodLogFormScreenFooterControls() {
  const { t } = useTranslation();

  const { handleNext, step } = useMoodLogFormContext();

  return (
    <View className="justify-center border-t-hairline border-border bg-card py-3">
      <Button
        className="self-center"
        label={t(step === steps.length - 1 ? "common.save" : "common.next")}
        onPress={handleNext}
      />
    </View>
  );
}

function MoodLogFormScreenHeaderControls() {
  const { handleBack, step } = useMoodLogFormContext();

  const theme = useTheme();

  return (
    <View className="pt-safe bg-card">
      <View className="h-16 flex-row items-center justify-start border-b-hairline border-border px-6">
        <InteractivePressable onPress={handleBack} hitSlop={10}>
          <Ionicons
            color={theme.colors.primary}
            name="chevron-back"
            size={24}
          />
        </InteractivePressable>
      </View>
      <Animated.View
        className="h-0.5 w-10 bg-primary"
        layout={LinearTransition}
        style={{
          width: (WINDOW_WIDTH / steps.length) * (step + 1),
        }}
      />
    </View>
  );
}

export function MoodLogFormScreen() {
  return (
    <MoodLogFormProvider stepsLength={steps.length}>
      <View className="flex-1">
        <MoodLogFormScreenHeaderControls />
        <KeyboardAvoidingView behavior={"padding"} className="flex-1">
          <MoodLogFormScreenStepComponent />
          <MoodLogFormScreenFooterControls />
        </KeyboardAvoidingView>
        <View className="pb-safe bg-card" />
      </View>
    </MoodLogFormProvider>
  );
}
