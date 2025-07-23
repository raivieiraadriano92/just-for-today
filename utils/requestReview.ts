import { useActivityStore } from "@/features/activity/store/activityStore";
import { useUserStore } from "@/features/user/store/userStore";
import i18n from "@/i18n";
import { differenceInDays, parseISO } from "date-fns";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import { Alert, Linking, Platform } from "react-native";

export async function requestReview(shouldValidate = true) {
  const { counters } = useActivityStore.getState();

  const { lastReviewRequestDate, setLastReviewRequestDate } =
    useUserStore.getState();

  if (
    counters.gratitudeLogs > 3 ||
    counters.intentions > 3 ||
    counters.moodLogs > 3 ||
    counters.reflections > 3 ||
    !shouldValidate
  ) {
    const lastDate = lastReviewRequestDate
      ? parseISO(lastReviewRequestDate)
      : new Date();

    const diffInDays = differenceInDays(new Date(), lastDate);

    if (!lastReviewRequestDate || diffInDays > 14 || !shouldValidate) {
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
            i18n.t("requestReview.title"),
            i18n.t("requestReview.description"),
            [
              {
                text: i18n.t("common.later"),
                style: "cancel",
              },
              {
                text: i18n.t("requestReview.cta"),
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
