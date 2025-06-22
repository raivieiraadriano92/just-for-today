import { useUserStore } from "@/features/user/store/userStore";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { isOnboardingCompleted, user } = useUserStore();

  if (user && isOnboardingCompleted) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
