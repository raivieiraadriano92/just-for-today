import { useInteractivePress } from "@/hooks/useInteractivePress";
import { Pressable, PressableProps } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InteractivePressable({
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: PressableProps) {
  const {
    interactiveAnimatedStyle,
    interactiveOnPressIn,
    interactiveOnPressOut,
  } = useInteractivePress({ disabled: !!disabled });

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
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
