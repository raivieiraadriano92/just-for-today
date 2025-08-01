import i18n from "@/i18n";
import {
  cancelScheduledNotificationAsync,
  requestNotificationPermission,
  scheduleDailyNotification,
} from "@/utils/notifications";
import { reloadWidgets, setWidgetUserDisplayName } from "@/utils/widgets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// AsyncStorage.clear(); // Clear AsyncStorage for testing purposes

export enum NotificationType {
  MORNING_NOTIFICATION = "MORNING_NOTIFICATION",
  AFTERNOON_NOTIFICATION = "AFTERNOON_NOTIFICATION",
  EVENING_NOTIFICATION = "EVENING_NOTIFICATION",
}

export type NotificationTime = `${number}${number}:${number}${number}`; // ISO 8601 format HH:mm

type Settings = {
  notifications: Record<
    NotificationType,
    {
      enabled: boolean;
      time: NotificationTime;
    }
  >;
};

export type User = {
  createdAt: string;
  name: string;
};

type UserStoreState = {
  isHomeWidgetsPresentationCompleted: boolean;
  isOnboardingCompleted: boolean;
  lastReviewRequestDate?: string; // ISO format
  settings: Settings;
  user: User | null;
};

type UserStoreActions = {
  completeHomeWidgetsPresentation: () => void;
  completeOnboarding: () => void;
  setLastReviewRequestDate: (date: string) => void;
  setUser: (user: User) => void;
  setEnabledNotification: (
    type: NotificationType,
    enabled: boolean,
  ) => Promise<void>;
  setTimeNotification: (type: NotificationType, time: NotificationTime) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

const handleNotificationSchedule = async ({
  enabled,
  time,
  type,
  userName,
}: {
  enabled: boolean;
  time: NotificationTime;
  type: NotificationType;
  userName: string;
}) => {
  const granted = await requestNotificationPermission();

  if (granted && enabled) {
    await scheduleDailyNotification({
      identifier: type,
      hour: parseInt(time.split(":")[0]),
      minute: parseInt(time.split(":")[1]),
      title: i18n.t(`features.user.notifications.${type}.messageTitle`, {
        user: userName,
      }),
      body: i18n.t(`features.user.notifications.${type}.messageBody`, {
        user: userName,
      }),
    });
  } else {
    await cancelScheduledNotificationAsync(type);
  }
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isHomeWidgetsPresentationCompleted: false,
      isOnboardingCompleted: false,
      settings: {
        notifications: {
          [NotificationType.MORNING_NOTIFICATION]: {
            enabled: false,
            time: "09:00",
          },
          [NotificationType.AFTERNOON_NOTIFICATION]: {
            enabled: false,
            time: "15:00",
          },
          [NotificationType.EVENING_NOTIFICATION]: {
            enabled: false,
            time: "21:00",
          },
        },
      },
      user: null,

      completeHomeWidgetsPresentation: () => {
        const current = get().user;
        if (!current) return;
        set({ isHomeWidgetsPresentationCompleted: true });
      },

      completeOnboarding: () => {
        const current = get().user;
        if (!current) return;
        set({ isOnboardingCompleted: true });
      },

      setLastReviewRequestDate: (date) => {
        set({ lastReviewRequestDate: date });
      },

      setUser: (user) => {
        try {
          setWidgetUserDisplayName(user.name);
          reloadWidgets();
        } catch (error) {
          console.error("Error setting widget user display name:", error);
        }

        set({ user });
      },

      setEnabledNotification: async (type, enabled) => {
        const userName = get().user?.name;

        if (userName) {
          await handleNotificationSchedule({
            enabled,
            time: get().settings.notifications[type].time,
            type,
            userName: userName,
          });
        }

        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [type]: {
                ...state.settings.notifications[type],
                enabled,
              },
            },
          },
        }));
      },

      setTimeNotification: async (type, time) => {
        const userName = get().user?.name;

        if (userName) {
          await handleNotificationSchedule({
            enabled: true,
            time,
            type,
            userName: userName,
          });
        }

        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [type]: {
                ...state.settings.notifications[type],
                time,
              },
            },
          },
        }));
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isHomeWidgetsPresentationCompleted:
          state.isHomeWidgetsPresentationCompleted,
        isOnboardingCompleted: state.isOnboardingCompleted,
        lastReviewRequestDate: state.lastReviewRequestDate,
        settings: state.settings,
        user: state.user,
      }),
    },
  ),
);
