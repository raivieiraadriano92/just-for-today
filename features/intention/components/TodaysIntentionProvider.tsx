import { FunctionComponent, PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useTodaysIntentionStore } from "../store/todaysIntentionStore";

export const TodaysIntentionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { loadTodaysIntention } = useTodaysIntentionStore();

  useEffect(() => {
    const loadTodaysIntentionOnMount = async () => {
      console.log("Loading today's intention on mount...");
      await loadTodaysIntention(); // Load on mount
    };

    loadTodaysIntentionOnMount();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        loadTodaysIntention(); // Load on resume
        console.log("Loading today's intention on resume...");
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
