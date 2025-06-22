import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
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
        <Text className="text-text text-3xl font-semibold">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenPrivacyMessage.title",
          )}
        </Text>
        <Text className="text-text mt-3 text-xl font-semibold">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenPrivacyMessage.subtitle",
          )}
        </Text>
        <Text className="text-text/60 dark:text-text/80 text-lg font-normal">
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
        <Text className="text-text text-3xl font-semibold">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenCommitment.title",
          )}
        </Text>
      </View>
      <View>
        {[...Array.from({ length: 7 }, (_, index) => index)].map((_, index) => (
          <View key={index}>
            {!!index && (
              <View className="ml-7 h-6 w-0.5 bg-green-500 dark:bg-green-400" />
            )}
            <View className="flex-row items-center gap-6">
              <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-green-500 dark:border-green-400">
                <IconSymbol
                  color={theme.dark ? twColors.green[400] : twColors.green[500]}
                  name={"checkmark.circle.fill"}
                  size={24}
                />
              </View>
              <Text className="text-text text-xl font-semibold">
                {t(
                  `features.user.screens.OnboardingScreen.OnboardingScreenCommitment.items.${index}`,
                )}
              </Text>
            </View>
          </View>
        ))}
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
    <View className="border-border border-t-hairline bg-card justify-center py-3">
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
      <View className="border-b-hairline border-border h-16 flex-row items-center justify-start px-6">
        <InteractivePressable onPress={handleBack} hitSlop={10}>
          <IconSymbol
            color={theme.colors.primary}
            name="chevron.left"
            size={24}
          />
        </InteractivePressable>
      </View>
      <Animated.View
        className="bg-primary h-0.5 w-10"
        layout={LinearTransition}
        style={{
          width: (WINDOW_WIDTH / steps.length) * (step + 1),
        }}
      />
    </View>
  );
}

function OnboardingScreenHandler() {
  const { isCommitmentAccepted } = useOnboardingContext();

  const { completeOnboarding, user } = useUserStore();

  const { t } = useTranslation();

  if (isCommitmentAccepted) {
    return (
      <Animated.View className="flex-1" entering={FadeIn} key="successScreen">
        <Animated.View
          className="max-w-sm flex-1 items-center justify-center gap-3 self-center"
          entering={BounceIn}
          key="successContent"
        >
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text className="text-text text-center text-3xl font-semibold leading-relaxed">
            {t("features.user.screens.OnboardingScreen.successTitle", {
              name: user?.name,
            })}
          </Text>
        </Animated.View>
        <Confetti
          autoplay
          count={400}
          fallDuration={3000}
          isInfinite={false}
          onAnimationEnd={completeOnboarding}
        />
      </Animated.View>
    );
  }

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
