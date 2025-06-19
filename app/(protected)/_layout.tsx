import { useUserStore } from "@/features/user/store/userStore";
import { useTheme } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { user } = useUserStore();

  const theme = useTheme();

  if (!user?.isOnboardingCompleted) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.card },
        headerShown: false,
      }}
    >
      <Stack.Screen name="intention/index" />
      <Stack.Screen
        name="intention/success"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
