import { InteractivePressable } from "@/components/InteractivePressable";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import twColors from "tailwindcss/colors";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View className="pt-safe flex-1">
      <View className="h-16 flex-row items-center justify-between px-6">
        <InteractivePressable className="flex-row items-center gap-2">
          <IconSymbol
            color={theme.colors.primary}
            name="flame.fill"
            size={24}
          />
          <Text className="text-primary text-base font-medium">1</Text>
        </InteractivePressable>
        <Link asChild href="/settings">
          <InteractivePressable>
            <IconSymbol
              color={theme.colors.primary}
              name="gearshape.fill"
              size={24}
            />
          </InteractivePressable>
        </Link>
      </View>
      <View className="flex-1 gap-12 p-6">
        <View className="bg-card flex-row items-center justify-evenly rounded-2xl p-3">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <InteractivePressable key={index}>
              <CircularProgressBase
                activeStrokeWidth={3}
                inActiveStrokeWidth={3}
                inActiveStrokeOpacity={1}
                // @todo: remove mock value
                value={index === 3 ? 75 : 0}
                radius={20}
                activeStrokeColor={twColors.green[theme.dark ? 400 : 500]}
                // @todo: remove mock value
                inActiveStrokeColor={
                  index > 3 ? "transparent" : theme.colors.border
                }
              >
                <Text className="text-text text-center text-base font-semibold">
                  {day}
                </Text>
              </CircularProgressBase>
            </InteractivePressable>
          ))}
        </View>
        <View className="bg-card flex-1 items-center justify-center gap-6 rounded-2xl p-6">
          <View className="absolute left-6 top-6 opacity-10">
            <IconSymbol
              color={theme.colors.text}
              name="quote.opening"
              size={80}
            />
          </View>
          <View className="absolute bottom-6 right-6 opacity-10">
            <IconSymbol
              color={theme.colors.text}
              name="quote.closing"
              size={80}
            />
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
      </View>
    </View>
  );
}
