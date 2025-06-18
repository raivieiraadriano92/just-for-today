import { useUserStore } from "@/features/user/store/userStore";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { user } = useUserStore();

  if (!user?.isOnboardingCompleted) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
