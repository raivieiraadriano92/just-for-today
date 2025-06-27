import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

import { TabBarButton } from "@/components/TabBarButton";
import Ionicons from "@expo/vector-icons/Ionicons";

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
            <Ionicons color={color} name="home" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("app.tabs.journey.label"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="book" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t("app.tabs.stats.label"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="stats-chart" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
