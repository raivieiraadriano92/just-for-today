import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

function rgbToHex(color: string) {
  if (color.startsWith("#") || !color.startsWith("rgb")) {
    return color;
  }
  // Convert each color component (r, g, b) to its hexadecimal representation.
  // toString(16) converts a number to a hexadecimal string.
  const [r, g, b] = color
    .replace(/rgba?\(|\s|\)/g, "")
    .split(",")
    .map(Number);

  let hexR = r.toString(16);
  let hexG = g.toString(16);
  let hexB = b.toString(16);

  // Ensure each hexadecimal component is two digits long by prepending a '0' if necessary.
  if (hexR.length === 1) {
    hexR = "0" + hexR;
  }
  if (hexG.length === 1) {
    hexG = "0" + hexG;
  }
  if (hexB.length === 1) {
    hexB = "0" + hexB;
  }

  // Concatenate the hexadecimal components and prepend '#' to form the final hex color string.
  return "#" + hexR + hexG + hexB;
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={rgbToHex(color)}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
