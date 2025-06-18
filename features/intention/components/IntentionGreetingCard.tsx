import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export function IntentionGreetingCard() {
  const theme = useTheme();

  return (
    <View className="bg-card flex-1 items-center justify-center gap-6 rounded-2xl p-6">
      <View className="absolute left-6 top-6 opacity-10">
        <IconSymbol color={theme.colors.text} name="quote.opening" size={80} />
      </View>
      <View className="absolute bottom-6 right-6 opacity-10">
        <IconSymbol color={theme.colors.text} name="quote.closing" size={80} />
      </View>
      <View className="items-center gap-3">
        <Text className="text-text text-center text-2xl font-medium leading-relaxed">
          Hi Raí
        </Text>
        <Text className="text-text max-w-md text-center text-3xl font-semibold leading-relaxed">
          Each sunrise brings a choice — what will you choose,{" "}
          <Text className="text-text max-w-md text-center text-3xl font-bold leading-relaxed">
            Just for Today?
          </Text>
        </Text>
      </View>
      <TouchableOpacity className="bg-primary h-12 items-center justify-center rounded-full px-6">
        <Text className="text-base font-medium text-white">
          Today I will...
        </Text>
      </TouchableOpacity>
    </View>
  );
}
