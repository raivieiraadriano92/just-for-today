import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import { useUserStore } from "../store/userStore";

export function UserNameForm() {
  const { t } = useTranslation();

  const { setUser, user } = useUserStore();

  const refDebounce = useRef<number>(null);

  const handleOnChangeText = (value: string) => {
    if (refDebounce.current) {
      clearTimeout(refDebounce.current);
    }

    refDebounce.current = setTimeout(() => {
      setUser(
        user
          ? { ...user, name: value }
          : { name: value, createdAt: new Date().toISOString() },
      );
    }, 300);
  };

  return (
    <View className="flex-1 gap-12 p-6 pt-12">
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenName.title",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.user.screens.OnboardingScreen.OnboardingScreenName.description",
          )}
        </Text>
      </View>
      <View className="flex-1">
        <TextInput
          autoCorrect={false}
          autoFocus
          className="text-lg font-normal text-text"
          defaultValue={user?.name || ""}
          onChangeText={handleOnChangeText}
          placeholder={t(
            "features.user.screens.OnboardingScreen.OnboardingScreenName.inputPlaceholder",
          )}
        />
      </View>
    </View>
  );
}
