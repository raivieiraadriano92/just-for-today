import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View>
      <Text>This screen does not exist.</Text>
      <Link href="/">
        <Text>Go to home screen!</Text>
      </Link>
    </View>
  );
}
