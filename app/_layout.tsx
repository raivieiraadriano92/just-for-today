import "@/global.css";
import "@/i18n";
import "react-native-reanimated";

import { DATABASE_NAME, drizzleDb } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { ActivityProvider } from "@/features/activity/components/ActivityProvider";
import { TodaysIntentionProvider } from "@/features/intention/components/TodaysIntentionProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { preventAutoHideAsync, setOptions } from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { vexo } from "vexo-analytics";

const sentryDns = process.env.EXPO_PUBLIC_SENTRY_DNS;

if (!sentryDns) {
  throw new Error(
    "Sentry DSN is not set. Please set EXPO_PUBLIC_SENTRY_DNS in your environment variables.",
  );
}

Sentry.init({
  dsn: sentryDns,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  enabled: !__DEV__,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Keep splash screen visible while we fetch resources
preventAutoHideAsync();

setOptions({
  duration: 500,
  fade: true,
});

if (!__DEV__) {
  const vexoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

  if (!vexoApiKey) {
    throw new Error(
      "Vexo API key is not set. Please set VEXO_API_KEY in your environment variables.",
    );
  }

  vexo(vexoApiKey);
}

const theme = {
  default: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "rgb(236, 239, 242)",
      card: "rgb(249, 251, 252)",
      primary: "rgb(76, 148, 171)",
      text: "rgb(51, 51, 51)",
      border: "rgb(215, 224, 229)",
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "rgb(15, 37, 46)",
      card: "rgb(28, 51, 61)",
      primary: "rgb(104, 179, 201)",
      text: "rgb(228, 228, 231)",
      border: "rgb(43, 74, 85)",
    },
  },
};

export default Sentry.wrap(function RootLayout() {
  const { colorScheme } = useColorScheme();

  const { success, error } = useMigrations(drizzleDb, migrations);

  // if (!loaded) {
  //   // Async font loading only occurs in development.
  //   return null;
  // }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <KeyboardProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? theme.dark : theme.default}
          >
            <TodaysIntentionProvider>
              <ActivityProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(onboarding)" />
                  <Stack.Screen name="(protected)" />
                  <Stack.Screen
                    name="+not-found"
                    options={{ headerShown: true, title: "Oops!" }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </ActivityProvider>
            </TodaysIntentionProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SQLiteProvider>
    </Suspense>
  );
});
