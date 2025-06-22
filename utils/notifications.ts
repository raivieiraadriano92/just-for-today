// import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function requestNotificationPermission(): Promise<boolean> {
  //   if (!Device.isDevice) return false;

  const settings = await Notifications.getPermissionsAsync();
  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const result = await Notifications.requestPermissionsAsync();
  return (
    result.granted ||
    result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleDailyNotification({
  identifier,
  hour,
  minute,
  title,
  body,
}: {
  identifier: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
}): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title,
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelScheduledNotificationAsync(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
