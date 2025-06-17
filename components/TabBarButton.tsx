import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPlatformPressable =
  Animated.createAnimatedComponent(PlatformPressable);

export function TabBarButton({
  onPressIn,
  style,
  ...props
}: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Add a soft haptic feedback when pressing down on the tabs.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Scale the button down to give a pressed effect.
        scale.value = withTiming(0.8);

        onPressIn?.(ev);
      }}
      onPressOut={() => {
        // Scale the button back up when releasing the press.
        scale.value = withSpring(1);
      }}
      style={[style, animatedStyle]}
    />
  );
}
