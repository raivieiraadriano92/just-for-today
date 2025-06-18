import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  isOnboardingCompleted: boolean;
  name: string;
};

type UserStoreState = {
  user: User | null;
};

type UserStoreActions = {
  completeOnboarding: () => void;
  setUser: (user: User) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      /**
       * @todo remove mock user data once the onboarding flow is implemented
       */
      user: __DEV__ ? { isOnboardingCompleted: false, name: "USER" } : null,

      completeOnboarding: () => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, isOnboardingCompleted: true } });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
