import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

import { TabBarButton } from "@/components/TabBarButton";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        animation: "fade",
        // headerTransparent: true,
        headerShown: false,
        tabBarButton: TabBarButton,
        // // tabBarBackground: <BlurView
        //       // System chrome material automatically adapts to the system's theme
        //       // and matches the native tab bar appearance on iOS.
        //       tint="systemChromeMaterial"
        //       intensity={100}
        //       style={StyleSheet.absoluteFill}
        //     />,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: "absolute",
        //   },
        //   default: {},
        // }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("app.tabs.home.label"),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("app.tabs.journey.label"),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t("app.tabs.stats.label"),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="chart.bar.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
