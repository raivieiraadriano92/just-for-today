import { useInteractivePress } from "@/hooks/useInteractivePress";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import Animated from "react-native-reanimated";

const AnimatedPlatformPressable =
  Animated.createAnimatedComponent(PlatformPressable);

export function TabBarButton({
  onPressIn,
  onPressOut,
  style,
  ...props
}: BottomTabBarButtonProps) {
  const {
    interactiveAnimatedStyle,
    interactiveOnPressIn,
    interactiveOnPressOut,
  } = useInteractivePress();

  return (
    <AnimatedPlatformPressable
      {...props}
      onPressIn={(ev) => {
        interactiveOnPressIn();

        onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        interactiveOnPressOut();

        onPressOut?.(ev);
      }}
      style={[style, interactiveAnimatedStyle]}
    />
  );
}
