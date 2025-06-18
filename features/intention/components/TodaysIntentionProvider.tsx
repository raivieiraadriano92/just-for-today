import { hideAsync } from "expo-splash-screen";
import { FunctionComponent, PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useTodaysIntentionStore } from "../store/todaysIntentionStore";

export const TodaysIntentionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { loadTodaysIntention } = useTodaysIntentionStore();

  useEffect(() => {
    const loadTodaysIntentionOnMount = async () => {
      console.log("Loading on mount...");
      await loadTodaysIntention(); // Load on mount

      // This becomes the single point where we hide the splash screen
      // Hide the splash screen after a short delay to prevent flickering
      setTimeout(() => {
        hideAsync();
      }, 500);
    };

    loadTodaysIntentionOnMount();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        loadTodaysIntention(); // Load on resume
        console.log("Loading on resume...");
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [loadTodaysIntention]);

  return <>{children}</>;
};
