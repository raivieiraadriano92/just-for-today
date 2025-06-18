import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/features/user/store/userStore";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  const { setUser } = useUserStore();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Settings</Text>
      <Button
        className="bg-red-500 dark:bg-red-400"
        label="Log Out"
        onPress={() => setUser(null)}
      />
    </View>
  );
}
