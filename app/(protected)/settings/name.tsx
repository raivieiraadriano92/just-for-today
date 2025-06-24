import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { UserNameForm } from "@/features/user/components/UserNameForm";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function UserNameScreen() {
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <>
      <View className="pt-safe bg-card">
        <View className="h-16 items-center justify-center border-b-hairline border-border px-6">
          <InteractivePressable
            className="self-start"
            onPress={router.back}
            hitSlop={10}
          >
            <IconSymbol
              color={theme.colors.primary}
              name="chevron.left"
              size={24}
            />
          </InteractivePressable>
        </View>
      </View>
      <UserNameForm />
      <View className="pb-safe-offset-3 justify-center border-t-hairline border-border bg-card pt-3">
        <Button
          className="self-center"
          label={t("common.save")}
          onPress={router.back}
        />
      </View>
    </>
  );
}
