import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/features/user/store/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { createRef, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  IntentionFormProvider,
  useIntentionFormContext,
} from "../components/IntentionFormProvider";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function IntentionFormScreenIntro() {
  const { t } = useTranslation();

  const { user } = useUserStore();

  return (
    <View className="max-w-sm flex-1 items-center justify-center gap-3 self-center p-6">
      <Text className="text-center" style={{ fontSize: 48 }}>
        🌞
      </Text>
      <Text className="text-center text-3xl font-semibold text-text">
        {t(
          "features.intention.screens.IntentionFormScreen.IntentionFormScreenIntro.title",
          { name: user?.name },
        )}
      </Text>
      <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
        {t(
          "features.intention.screens.IntentionFormScreen.IntentionFormScreenIntro.description",
        )}
      </Text>
    </View>
  );
}

function IntentionFormScreenIntention() {
  const { t } = useTranslation();

  const { payload, setIntention, step } = useIntentionFormContext();

  const refDebounce = useRef<number>(null);

  const inputRef = useRef<TextInput>(null);

  const handleOnChangeText = (value: string) => {
    if (refDebounce.current) {
      clearTimeout(refDebounce.current);
    }

    refDebounce.current = setTimeout(() => {
      setIntention(value);
    }, 300);
  };

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [step]);

  return (
    <View className="flex-1 gap-12 p-6 pt-12">
      <Text className="text-3xl font-semibold text-text">
        {t(
          "features.intention.screens.IntentionFormScreen.IntentionFormScreenIntention.title",
        )}
      </Text>
      <View className="flex-1">
        <TextInput
          className="text-xl font-medium text-text"
          defaultValue={payload.intention}
          onChangeText={handleOnChangeText}
          placeholder={t(
            "features.intention.screens.IntentionFormScreen.IntentionFormScreenIntention.inputPlaceholder",
          )}
          ref={inputRef}
        />
      </View>
    </View>
  );
}

function IntentionFormScreenCommit() {
  const { t } = useTranslation();

  const { user } = useUserStore();

  const { payload } = useIntentionFormContext();

  return (
    <View className="max-w-sm flex-1 items-center justify-center gap-12 self-center p-6">
      <View className="gap-3">
        <Text className="text-center" style={{ fontSize: 48 }}>
          🌞
        </Text>
        <Text className="text-center text-3xl font-medium text-text">
          {t(
            "features.intention.screens.IntentionFormScreen.IntentionFormScreenCommit.title",
            { name: user?.name },
          )}
        </Text>
        <Text className="text-center text-xl font-semibold text-text">
          {t(
            "features.intention.screens.IntentionFormScreen.IntentionFormScreenCommit.subtitle",
          )}
        </Text>
      </View>
      <Text className="text-center text-4xl font-semibold leading-relaxed text-text">
        {`“${t(
          "features.intention.screens.IntentionFormScreen.IntentionFormScreenCommit.message",
          { name: user?.name, intention: payload.intention.toLowerCase() },
        )}”`}
      </Text>
    </View>
  );
}

const steps = [
  IntentionFormScreenIntro,
  IntentionFormScreenIntention,
  IntentionFormScreenCommit,
];

const pagerViewRef = createRef<PagerView>();

function IntentionFormScreenStepComponent() {
  const { payload, setStep, step } = useIntentionFormContext();

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
      scrollEnabled={!!payload.intention}
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

function IntentionFormScreenFooterControls() {
  const { t } = useTranslation();

  const { handleNext, step } = useIntentionFormContext();

  return (
    <View className="justify-center border-t-hairline border-border bg-card py-3">
      <Button
        className="self-center"
        label={t(
          step === steps.length - 1
            ? "features.intention.screens.IntentionFormScreen.finishButtonLabel"
            : "common.next",
        )}
        onPress={handleNext}
      />
    </View>
  );
}

function IntentionFormScreenHeaderControls() {
  const { handleBack, step } = useIntentionFormContext();

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

export function IntentionFormScreen() {
  return (
    <IntentionFormProvider stepsLength={steps.length}>
      <View className="flex-1">
        <IntentionFormScreenHeaderControls />
        <KeyboardAvoidingView behavior={"padding"} className="flex-1">
          <IntentionFormScreenStepComponent />
          <IntentionFormScreenFooterControls />
        </KeyboardAvoidingView>
        <View className="pb-safe bg-card" />
      </View>
    </IntentionFormProvider>
  );
}
