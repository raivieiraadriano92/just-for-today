import { Emitter, EventKey } from "@/utils/emitter";
import { hideAsync } from "expo-splash-screen";
import {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { useActivityStore } from "../store/activityStore";

export const ActivityProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { loadWeeklyProgress } = useActivityStore();

  const loadActivityData = useCallback(async () => {
    await loadWeeklyProgress();
  }, [loadWeeklyProgress]);

  useEffect(() => {
    const loadActivityDataOnMount = async () => {
      console.log("Loading activity data on mount...");
      await loadActivityData(); // Load on mount

      // This becomes the single point where we hide the splash screen
      // Hide the splash screen after a short delay to prevent flickering
      setTimeout(() => {
        hideAsync();
      }, 500);
    };

    loadActivityDataOnMount();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        loadActivityData(); // Load on resume
        console.log("Loading activity data on resume...");
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [loadActivityData]);

  // Listen for changes in intentions, moods, gratitude, and reflections and reload activity data accordingly
  // This ensures that the activity data is always up-to-date when these events occur
  useEffect(() => {
    const events: EventKey[] = [
      "intention:changed",
      "mood:changed",
      "gratitude:changed",
      "reflection:changed",
    ];

    Emitter.onMany(events, async (event, payload) => {
      console.log(`Event received: ${event}`, payload);
      await loadActivityData();
    });

    return () => {
      Emitter.offMany(events, async (event, payload) => {
        console.log(`Removing listener for event: ${event}`, payload);
      });
    };
  }, [loadActivityData]);

  return <>{children}</>;
};
