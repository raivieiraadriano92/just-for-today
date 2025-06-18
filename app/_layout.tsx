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
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { preventAutoHideAsync, setOptions } from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

// Keep splash screen visible while we fetch resources
preventAutoHideAsync();

setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
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
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <TodaysIntentionProvider>
              <ActivityProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
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
}
