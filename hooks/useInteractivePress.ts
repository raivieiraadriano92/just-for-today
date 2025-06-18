import * as Haptics from "expo-haptics";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function useInteractivePress() {
  const scale = useSharedValue(1);

  const interactiveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    interactiveAnimatedStyle,
    interactiveOnPressIn: () => {
      // Add a soft haptic feedback when pressing down on the tabs.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Scale the button down to give a pressed effect.
      scale.value = withTiming(0.8);
    },
    interactiveOnPressOut: () => {
      // Scale the button back up when releasing the press.
      scale.value = withSpring(1);
    },
  };
}
