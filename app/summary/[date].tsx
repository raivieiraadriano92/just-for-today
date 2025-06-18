import { isValid } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SummaryByDateScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const isValidDate = isValid(date);

  if (!isValidDate) {
    return (
      <View>
        <Text>Invalid date format. Please use YYYY-MM-DD.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Summary by Date: {date}</Text>
    </View>
  );
}
