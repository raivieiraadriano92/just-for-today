import { useActivityStore } from "@/features/activity/store/activityStore";
import { useUserStore } from "@/features/user/store/userStore";
import { differenceInDays, parseISO } from "date-fns";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import { Alert, Linking, Platform } from "react-native";

export async function requestReview() {
  const { counters } = useActivityStore.getState();

  const { lastReviewRequestDate, setLastReviewRequestDate } =
    useUserStore.getState();

  if (
    counters.gratitudeLogs > 3 ||
    counters.intentions > 3 ||
    counters.moodLogs > 3 ||
    counters.reflections > 3
  ) {
    const lastDate = lastReviewRequestDate
      ? parseISO(lastReviewRequestDate)
      : new Date();

    const diffInDays = differenceInDays(new Date(), lastDate);

    if (!lastReviewRequestDate || diffInDays > 14) {
      const hasAction = await StoreReview.hasAction();

      if (hasAction) {
        StoreReview.requestReview();
      } else {
        const url = Platform.select({
          ios: `${Constants.expoConfig?.ios?.appStoreUrl}?action=write-review`,
          android: `${Constants.expoConfig?.android?.playStoreUrl}&showAllReviews=true`,
        });

        const canOpen = await Linking.canOpenURL(url || "");

        if (url && canOpen) {
          Alert.alert(
            "Thanks for using Just For Today!",
            "If you enjoy it, please consider leaving a review.",
            [
              {
                text: "Later",
                style: "cancel",
              },
              {
                text: "Rate Now",
                onPress: () => {
                  Linking.openURL(url);
                },
              },
            ],
          );
        }
      }
      setLastReviewRequestDate(new Date().toISOString());
      return;
    }
  }
}
