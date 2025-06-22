import { InteractivePressable } from "@/components/InteractivePressable";
import { useTheme } from "@react-navigation/native";
import { format, setHours, setMinutes } from "date-fns";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import {
  NotificationTime,
  NotificationType,
  useUserStore,
} from "../store/userStore";

export function NotificationsForm() {
  const { t } = useTranslation();

  const { setEnabledNotification, setTimeNotification, settings } =
    useUserStore();

  const theme = useTheme();

  const [selectedNotificationType, setSelectedNotificationType] =
    useState<NotificationType | null>(null);

  const selectedDate = useMemo(() => {
    if (!selectedNotificationType) return new Date();

    const time = settings.notifications[selectedNotificationType].time;
    const [hours, minutes] = time.split(":").map(Number);

    return setHours(setMinutes(new Date(), minutes), hours);
  }, [selectedNotificationType, settings.notifications]);

  return (
    <>
      <ScrollView
        contentContainerClassName="gap-12 p-6 pt-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <Text className="text-text text-3xl font-semibold">
            {t(
              "features.user.screens.OnboardingScreen.OnboardingScreenNotifications.title",
            )}
          </Text>
          <Text className="text-text/60 dark:text-text/80 text-lg font-normal">
            {t(
              "features.user.screens.OnboardingScreen.OnboardingScreenNotifications.description",
            )}
          </Text>
        </View>
        <View className="flex-1 gap-6">
          {(
            Object.keys(NotificationType) as (keyof typeof NotificationType)[]
          ).map((notificationType) => {
            const enabled = settings.notifications[notificationType].enabled;

            return (
              <View
                key={notificationType}
                className="bg-card gap-3 rounded-2xl p-6"
              >
                <Text className="text-text text-lg font-medium">
                  {t(
                    `features.user.notifications.${notificationType}.settingLabel`,
                  )}
                </Text>
                <View className="flex-row items-center justify-between">
                  <InteractivePressable
                    className={`rounded-lg px-2 py-1 ${enabled ? "bg-primary" : "bg-primary/10"}`}
                    disabled={!enabled}
                    onPress={() => {
                      setSelectedNotificationType(
                        NotificationType[notificationType],
                      );
                    }}
                  >
                    <Text
                      className={`text-primary text-lg font-medium ${enabled ? "text-white" : "text-primary"}`}
                    >
                      {settings.notifications[notificationType].time}
                    </Text>
                  </InteractivePressable>
                  <Switch
                    trackColor={{ true: theme.colors.primary }}
                    onValueChange={(enabled) =>
                      setEnabledNotification(
                        NotificationType[notificationType],
                        enabled,
                      )
                    }
                    value={enabled}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="time"
        open={!!selectedNotificationType}
        date={selectedDate}
        onConfirm={(date) => {
          if (selectedNotificationType) {
            setTimeNotification(
              selectedNotificationType,
              format(date, "HH:mm") as NotificationTime,
            );

            setSelectedNotificationType(null);
          }
        }}
        onCancel={() => {
          setSelectedNotificationType(null);
        }}
      />
    </>
  );
}
