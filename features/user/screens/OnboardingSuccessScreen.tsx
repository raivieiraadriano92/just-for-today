import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";
import { useUserStore } from "../store/userStore";

export function OnboardingSuccessScreen() {
  const { completeOnboarding, user } = useUserStore();

  const { t } = useTranslation();

  return (
    <>
      <Confetti
        autoplay
        count={400}
        fallDuration={3000}
        isInfinite={false}
        onAnimationEnd={completeOnboarding}
      />
      <View className="flex-1">
        <View
          className="max-w-sm flex-1 items-center justify-center gap-3 self-center"
          key="successContent"
        >
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text className="text-center text-3xl font-semibold leading-relaxed text-text">
            {t("features.user.screens.OnboardingScreen.successTitle", {
              name: user?.name,
            })}
          </Text>
        </View>
      </View>
    </>
  );
}
