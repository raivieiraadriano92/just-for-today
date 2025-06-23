import { useInteractivePress } from "@/hooks/useInteractivePress";
import { Pressable, PressableProps, Text } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "solid" | "outline" | "ghost";

type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
};

const variantStyles: Record<Variant, { container: string; text: string }> = {
  ghost: {
    container: "",
    text: "text-primary",
  },
  outline: {
    container: "border-border border",
    text: "text-text",
  },
  solid: {
    container: "bg-primary",
    text: "text-white dark:text-background",
  },
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
      className={`h-12 items-center justify-center rounded-full px-6 ${variantStyles[variant].container} ${className}`}
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
      <Text className={`text-base font-medium ${variantStyles[variant].text}`}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
