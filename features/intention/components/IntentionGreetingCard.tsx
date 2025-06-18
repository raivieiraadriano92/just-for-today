import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUserStore } from "@/features/user/store/userStore";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { HelloWave } from "./HelloWave";

export function IntentionGreetingCard() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { user } = useUserStore();

  return (
    <View className="bg-card flex-1 items-center justify-center gap-6 rounded-2xl p-6">
      <View className="absolute left-6 top-6 opacity-10">
        <IconSymbol color={theme.colors.text} name="quote.opening" size={80} />
      </View>
      <View className="absolute bottom-6 right-6 opacity-10">
        <IconSymbol color={theme.colors.text} name="quote.closing" size={80} />
      </View>
      <View className="items-center gap-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-text text-center text-2xl font-medium leading-relaxed">
            {t("features.intention.components.IntentionGreetingCard.greeting", {
              name: user?.name,
            })}
          </Text>
          <HelloWave />
        </View>
        <Text className="text-text text-center text-3xl font-semibold leading-relaxed">
          {`${t("features.intention.components.IntentionGreetingCard.quote.part1")} `}
          <Text className="text-text text-center text-3xl font-bold leading-relaxed">
            {t(
              "features.intention.components.IntentionGreetingCard.quote.part2",
            )}
          </Text>
        </Text>
      </View>
      <Link asChild href="/intention/[id]">
        <Button
          label={t(
            "features.intention.components.IntentionGreetingCard.ctaLabel",
          )}
        />
      </Link>
    </View>
  );
}
