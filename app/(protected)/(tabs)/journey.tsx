import { drizzleDb } from "@/db/client";
import {
  gratitudeLogsTable,
  intentionsTable,
  moodLogsTable,
  reflectionsTable,
} from "@/db/schema";
import { GratitudeLogRow } from "@/features/gratitude/store/gratitudeStore";
import { IntentionRow } from "@/features/intention/store/todaysIntentionStore";
import { moodTypes } from "@/features/mood/moodTypes";
import { MoodLogRow, MoodType } from "@/features/mood/store/moodLogStore";
import { ReflectionRow } from "@/features/reflection/store/reflectionStore";
import { useTheme } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

import twColors from "tailwindcss/colors";

type Data = (
  | (IntentionRow & { type: "intention" })
  | (MoodLogRow & { type: "moodLog" })
  | (GratitudeLogRow & { type: "gratitudeLog" })
  | (ReflectionRow & { type: "reflection" })
) & {
  date: string;
  time: Date;
};

type GroupedData = {
  [date: string]: Data[];
};

function groupDataByDate({
  intentions,
  moodLogs,
  gratitudeLogs,
  reflections,
}: {
  intentions: IntentionRow[];
  moodLogs: MoodLogRow[];
  gratitudeLogs: GratitudeLogRow[];
  reflections: ReflectionRow[];
}): GroupedData {
  const allItems = [
    ...intentions.map((i) => ({
      time: new Date(`${i.date}T00:00:00.000Z`), // fallback to midnight UTC
      type: "intention" as const,
      ...i,
    })),
    ...moodLogs.map((m) => ({
      date: format(parseISO(m.datetime), "yyyy-MM-dd"),
      time: parseISO(m.datetime),
      type: "moodLog" as const,
      ...m,
    })),
    ...gratitudeLogs.map((g) => ({
      date: format(parseISO(g.datetime), "yyyy-MM-dd"),
      time: parseISO(g.datetime),
      type: "gratitudeLog" as const,
      ...g,
    })),
    ...reflections.map((r) => ({
      date: format(parseISO(r.datetime), "yyyy-MM-dd"),
      time: parseISO(r.datetime),
      type: "reflection" as const,
      ...r,
    })),
  ];

  // Group by date
  const grouped: Record<string, typeof allItems> = {};

  for (const item of allItems) {
    if (!grouped[item.date]) {
      grouped[item.date] = [];
    }
    grouped[item.date].push(item);
  }

  // Sort each group by time descending
  for (const date in grouped) {
    grouped[date].sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  return grouped;
}

async function fetchData() {
  const [intentions, moodLogs, gratitudeLogs, reflections] = await Promise.all([
    drizzleDb.select().from(intentionsTable),
    drizzleDb.select().from(moodLogsTable),
    drizzleDb.select().from(gratitudeLogsTable),
    drizzleDb.select().from(reflectionsTable),
  ]);

  return groupDataByDate({
    intentions,
    moodLogs: moodLogs.map((log) => ({
      ...log,
      mood: log.mood as MoodType,
      feelings: log.feelings.split(",").filter(Boolean),
    })),
    gratitudeLogs: gratitudeLogs.map((log) => ({
      ...log,
      images: log.images.split(",").filter(Boolean),
    })),
    reflections: reflections.map((log) => ({
      ...log,
      images: log.images.split(",").filter(Boolean),
    })),
  });
}

export default function JourneyScreen() {
  const { t } = useTranslation();

  const [data, setData] = useState<[string, Data[]][]>([]);

  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchData().then((groupedData) => {
        setData(
          Object.entries(groupedData).sort(([dateA], [dateB]) => {
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          }),
        );
      });
    }, []),
  );

  return (
    <FlashList
      data={data}
      estimatedItemSize={100}
      ListFooterComponent={() =>
        data.length > 7 ? (
          <View className="items-center gap-3 py-6">
            <Text className="text-text/60 dark:text-text/80 text-base font-normal">
              {t("app.journey.endOfListTitle")}
            </Text>
            <Text style={{ fontSize: 20 }}>✌️</Text>
          </View>
        ) : (
          <View className="h-6" />
        )
      }
      ListHeaderComponent={() => (
        <View className="pt-safe-offset-6 px-6 pb-12">
          <Text className="text-text text-3xl font-semibold">
            {t("app.journey.title")}
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-6" />}
      keyExtractor={([date, data], index) => `${date}-${data.length}`}
      renderItem={({ item }) => {
        const date = parseISO(item[0]);

        let title = format(date, "EEEE, MMMM d");

        if (isToday(date)) {
          title = "Today";
        } else if (isYesterday(date)) {
          title = "Yesterday";
        }

        return (
          <View className="px-6">
            <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
              <Text className="text-primary text-base font-semibold">
                {title}
              </Text>
              <View className="gap-6">
                {item[1].map((entry) => {
                  switch (entry.type) {
                    case "intention":
                      return (
                        <View className="gap-2" key={entry.date}>
                          <Text className="text-text/60 dark:text-text/80 text-base font-semibold">
                            {t("app.journey.intentionTitle")}
                          </Text>
                          <Text className="text-text text-2xl font-bold">
                            {`“${entry.intention}”`}
                          </Text>
                        </View>
                      );
                    case "moodLog":
                      return (
                        <View className="gap-2" key={entry.id}>
                          <View className="mb-4 flex-row items-center justify-between gap-6">
                            <Text className="text-primary text-base font-semibold">
                              {format(entry.time, "h:mm a")}
                            </Text>
                            <View className="border-hairline border-border flex-1" />
                          </View>
                          <View className="flex-row gap-6">
                            <View
                              className={`bg-card h-14 w-14 items-center justify-center rounded-2xl border-2`}
                              style={{
                                borderColor:
                                  twColors[moodTypes[entry.mood].color.token][
                                    moodTypes[entry.mood].color[
                                      theme.dark ? "dark" : "light"
                                    ]
                                  ],
                              }}
                            >
                              <Text style={{ fontSize: 24 }}>
                                {moodTypes[entry.mood].icon}
                              </Text>
                            </View>
                            <View className="flex-1 gap-2">
                              <Text
                                className="text-text text-xl font-semibold"
                                style={{
                                  color:
                                    twColors[moodTypes[entry.mood].color.token][
                                      moodTypes[entry.mood].color[
                                        theme.dark ? "dark" : "light"
                                      ]
                                    ],
                                }}
                              >
                                {t(
                                  `features.moodLog.moodTypes.${entry.mood}.title`,
                                )}
                              </Text>
                              {!!entry.note && (
                                <Text className="text-text text-base">
                                  {`“${entry.note}”`}
                                </Text>
                              )}
                              {entry.feelings.length > 0 && (
                                <View className="flex-row flex-wrap items-center gap-4">
                                  {entry.feelings.map((feeling) => (
                                    <View
                                      key={feeling}
                                      className="rounded-2xl px-2 py-0.5"
                                      style={{
                                        backgroundColor:
                                          twColors[
                                            moodTypes[entry.mood].color.token
                                          ][
                                            moodTypes[entry.mood].color[
                                              theme.dark ? "dark" : "light"
                                            ]
                                          ],
                                      }}
                                    >
                                      <Text className="text-sm font-medium text-white dark:text-black">
                                        {t(
                                          `features.moodLog.moodTypes.${entry.mood}.feelings.${feeling}`,
                                        )}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    case "gratitudeLog":
                      return (
                        <View className="gap-2" key={entry.id}>
                          <View className="mb-4 flex-row items-center justify-between gap-6">
                            <Text className="text-primary text-base font-semibold">
                              {format(entry.time, "h:mm a")}
                            </Text>
                            <View className="border-hairline border-border flex-1" />
                          </View>
                          <View className="gap-2">
                            <Text className="text-text/60 dark:text-text/80 text-base font-semibold">
                              {`${t("app.journey.gratitudeLogTitle")} 🙏`}
                            </Text>
                            <Text className="text-text text-2xl font-bold">
                              {`“${entry.content}”`}
                            </Text>
                            {!!entry.images[0] && (
                              <Image
                                className="aspect-square rounded-lg"
                                source={{ uri: entry.images[0] }}
                                resizeMode="cover"
                              />
                            )}
                          </View>
                        </View>
                      );
                    case "reflection":
                      return (
                        <View className="gap-2" key={entry.id}>
                          <View className="mb-4 flex-row items-center justify-between gap-6">
                            <Text className="text-primary text-base font-semibold">
                              {format(entry.time, "h:mm a")}
                            </Text>
                            <View className="border-hairline border-border flex-1" />
                          </View>
                          <View className="gap-2">
                            <Text className="text-text/60 dark:text-text/80 text-base font-semibold">
                              {`${t("app.journey.reflectionTitle")} 📝`}
                            </Text>
                            <Text className="text-text text-2xl font-bold">
                              {`“${entry.content}”`}
                            </Text>
                            {!!entry.images[0] && (
                              <Image
                                className="aspect-square rounded-lg"
                                source={{ uri: entry.images[0] }}
                                resizeMode="cover"
                              />
                            )}
                          </View>
                        </View>
                      );
                    default:
                      return null;
                  }
                })}
              </View>
            </View>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
