import { useInteractivePress } from "@/hooks/useInteractivePress";
import { Pressable, PressableProps, Text } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = PressableProps & {
  label: string;
};

export function Button({
  className,
  label,
  onPressIn,
  onPressOut,
  style,
  ...props
}: ButtonProps) {
  const {
    interactiveAnimatedStyle,
    interactiveOnPressIn,
    interactiveOnPressOut,
  } = useInteractivePress();

  return (
    <AnimatedPressable
      className={`bg-primary h-12 items-center justify-center rounded-full px-6 ${className}`}
      onPressIn={(ev) => {
        interactiveOnPressIn();

        onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        interactiveOnPressOut();

        onPressOut?.(ev);
      }}
      style={[style, interactiveAnimatedStyle]}
      {...props}
    >
      <Text className="text-base font-medium text-white">{label}</Text>
    </AnimatedPressable>
  );
}
