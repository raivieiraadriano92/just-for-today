import { ExtensionStorage } from "@bacons/apple-targets";
import JustForTodayAndroidWidgets from "just-for-today-android-widgets";
import { Platform } from "react-native";

const widgetStorage = new ExtensionStorage("group.app.justfortoday.widgets");

export const reloadWidgets = () => {
  if (Platform.OS === "ios") {
    ExtensionStorage.reloadWidget();
  } else if (Platform.OS === "android") {
    JustForTodayAndroidWidgets.updateIntentionWidget();
    JustForTodayAndroidWidgets.updateGratitudeWidget();
  }
};

export const setWidgetUserDisplayName = async (displayName: string) => {
  if (Platform.OS === "ios") {
    widgetStorage.set("userDisplayName", displayName);
  } else if (Platform.OS === "android") {
    JustForTodayAndroidWidgets.setUserDisplayName(displayName);
  }
};

export const setWidgetIntention = async (intention: string, date: string) => {
  if (Platform.OS === "ios") {
    widgetStorage.set("intention:intention", intention);
    widgetStorage.set("intention:date", date);
  } else if (Platform.OS === "android") {
    JustForTodayAndroidWidgets.setIntention(intention, date);
  }
};

export const setWidgetGratitude = async (content: string) => {
  if (Platform.OS === "ios") {
    widgetStorage.set("gratitudeLog:content", content);

    ExtensionStorage.reloadWidget();
  } else if (Platform.OS === "android") {
    JustForTodayAndroidWidgets.setGratitude(content);
  }
};

export const setWidgetLanguage = async (language: string) => {
  if (Platform.OS === "ios") {
    widgetStorage.set("language", language);
  } else if (Platform.OS === "android") {
    JustForTodayAndroidWidgets.setLanguage(language);
  }
};
