import { useInteractivePress } from "@/hooks/useInteractivePress";
import { Pressable, PressableProps, Text } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = PressableProps & {
  label: string;
  variant?: "solid" | "outline";
};

export function Button({
  className,
  label,
  onPressIn,
  onPressOut,
  style,
  variant = "solid",
  ...props
}: ButtonProps) {
  const {
    interactiveAnimatedStyle,
    interactiveOnPressIn,
    interactiveOnPressOut,
  } = useInteractivePress();

  return (
    <AnimatedPressable
      className={`h-12 items-center justify-center rounded-full px-6 ${variant === "solid" ? "bg-primary" : "border-border border"} ${className}`}
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
      <Text
        className={`text-base font-medium ${variant === "solid" ? "text-white" : "text-text"}`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
