import * as Haptics from "expo-haptics";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type UseInteractivePressParams = {
  disabled?: boolean;
};

export function useInteractivePress(params?: UseInteractivePressParams) {
  const scale = useSharedValue(1);

  const interactiveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    interactiveAnimatedStyle,
    interactiveOnPressIn: () => {
      if (params?.disabled) {
        // If the button is disabled, do not provide any feedback.
        return;
      }

      // Add a soft haptic feedback when pressing down on the tabs.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Scale the button down to give a pressed effect.
      scale.value = withTiming(0.9);
    },
    interactiveOnPressOut: () => {
      if (params?.disabled) {
        // If the button is disabled, do not provide any feedback.
        return;
      }

      // Scale the button back up when releasing the press.
      scale.value = withSpring(1);
    },
  };
}
