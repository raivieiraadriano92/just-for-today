import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/features/user/store/userStore";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function OnboardingScreen() {
  const { user, completeOnboarding, setUser } = useUserStore();

  const handleFakeLogin = () => {
    setUser({ isOnboardingCompleted: false, name: "John" });
    completeOnboarding();
  };

  if (user && user.isOnboardingCompleted) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Button label="Log In" onPress={handleFakeLogin} />
    </View>
  );
}
