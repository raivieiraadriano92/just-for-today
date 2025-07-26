import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";
import twColors from "tailwindcss/colors";
import { NotificationsForm } from "../components/NotificationsForm";
import {
  OnboardingProvider,
  useOnboardingContext,
} from "../components/OnboardingProvider";
import { UserNameForm } from "../components/UserNameForm";
import { useUserStore } from "../store/userStore";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function OnboardingScreenPrivacyMessage() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="gap-12 p-6 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenPrivacyMessage.title",
          )}
        </Text>
        <Text className="mt-3 text-xl font-semibold text-text">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenPrivacyMessage.subtitle",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenPrivacyMessage.description",
          )}
        </Text>
      </View>
      <View className="flex-1"></View>
    </ScrollView>
  );
}

function OnboardingScreenCommitment() {
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <ScrollView
      contentContainerClassName="gap-12 p-6 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenCommitment.title",
          )}
        </Text>
      </View>
      <View>
        {[...Array.from({ length: 11 }, (_, index) => index)].map(
          (_, index) => (
            <View key={index}>
              {!!index && (
                <View className="ml-7 h-6 w-0.5 bg-green-500 dark:bg-green-400" />
              )}
              <View className="flex-row items-center gap-6">
                <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-green-500 dark:border-green-400">
                  <Ionicons
                    color={
                      theme.dark ? twColors.green[400] : twColors.green[500]
                    }
                    name="checkmark-circle"
                    size={24}
                  />
                </View>
                <Text className="text-xl font-semibold text-text">
                  {t(
                    `features.user.screens.OnboardingScreen.OnboardingScreenCommitment.items.${index}`,
                  )}
                </Text>
              </View>
            </View>
          ),
        )}
      </View>
    </ScrollView>
  );
}

const steps = [
  UserNameForm,
  NotificationsForm,
  OnboardingScreenPrivacyMessage,
  OnboardingScreenCommitment,
];

const pagerViewRef = createRef<PagerView>();

function OnboardingScreenStepComponent() {
  const { setStep, step } = useOnboardingContext();
  const { user } = useUserStore();

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
      scrollEnabled={!!user?.name}
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

function OnboardingScreenFooterControls() {
  const { t } = useTranslation();

  const { handleNext, step } = useOnboardingContext();

  return (
    <View className="justify-center border-t-hairline border-border bg-card py-3">
      <Button
        className="self-center"
        label={t(
          step === steps.length - 1
            ? "features.user.screens.OnboardingScreen.finishButtonLabel"
            : "common.next",
        )}
        onPress={handleNext}
      />
    </View>
  );
}

function OnboardingScreenHeaderControls() {
  const { handleBack, step } = useOnboardingContext();

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

function OnboardingScreenHandler() {
  return (
    <Animated.View className="flex-1" exiting={FadeOut} key="onboardingScreen">
      <OnboardingScreenHeaderControls />
      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <OnboardingScreenStepComponent />
        <OnboardingScreenFooterControls />
      </KeyboardAvoidingView>
      <View className="pb-safe bg-card" />
    </Animated.View>
  );
}

export function OnboardingScreen() {
  return (
    <OnboardingProvider stepsLength={steps.length}>
      <OnboardingScreenHandler />
    </OnboardingProvider>
  );
}
