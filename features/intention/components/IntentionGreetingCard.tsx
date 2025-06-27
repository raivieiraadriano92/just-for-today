import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/features/user/store/userStore";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTodaysIntentionStore } from "../store/todaysIntentionStore";
import { HelloWave } from "./HelloWave";

export function IntentionGreetingCard() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { user } = useUserStore();

  const { todaysIntention } = useTodaysIntentionStore();

  if (todaysIntention) {
    return (
      <View className="flex-1 items-center justify-center gap-3 rounded-2xl bg-card p-6">
        <View
          className="absolute left-6 top-6 opacity-10 dark:opacity-30"
          style={{ transform: [{ rotate: "180deg" }] }}
        >
          <Entypo color={theme.colors.text} name="quote" size={80} />
        </View>
        <View className="absolute bottom-6 right-6 opacity-10 dark:opacity-30">
          <Entypo color={theme.colors.text} name="quote" size={80} />
        </View>
        <View className="absolute right-6 top-6">
          <Link asChild href="/intention">
            <InteractivePressable>
              <Ionicons color={theme.colors.primary} name="pencil" size={24} />
            </InteractivePressable>
          </Link>
        </View>
        <Text className="text-center text-2xl font-medium leading-relaxed text-text">
          {`${t("features.intention.components.IntentionGreetingCard.intentionPrefix")} `}
        </Text>
        <Text className="text-center text-3xl font-bold leading-relaxed text-text">
          {`${todaysIntention.intention}`}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-6 rounded-2xl bg-card p-6">
      <View
        className="absolute left-6 top-6 opacity-10 dark:opacity-30"
        style={{ transform: [{ rotate: "180deg" }] }}
      >
        <Entypo color={theme.colors.text} name="quote" size={80} />
      </View>
      <View className="absolute bottom-6 right-6 opacity-10 dark:opacity-30">
        <Entypo color={theme.colors.text} name="quote" size={80} />
      </View>
      <View className="items-center gap-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-center text-2xl font-medium leading-relaxed text-text">
            {t("features.intention.components.IntentionGreetingCard.greeting", {
              name: user?.name,
            })}
          </Text>
          <HelloWave />
        </View>
        <Text className="text-center text-3xl font-semibold leading-relaxed text-text">
          {`${t("features.intention.components.IntentionGreetingCard.quote.part1")} `}
          <Text className="text-center text-3xl font-bold leading-relaxed text-text">
            {t(
              "features.intention.components.IntentionGreetingCard.quote.part2",
            )}
          </Text>
        </Text>
      </View>
      <Link asChild href="/intention">
        <Button
          label={t(
            "features.intention.components.IntentionGreetingCard.ctaLabel",
          )}
        />
      </Link>
    </View>
  );
}
