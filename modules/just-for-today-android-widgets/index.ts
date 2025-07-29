// Reexport the native module. On web, it will be resolved to JustForTodayAndroidWidgetsModule.web.ts
// and on native platforms to JustForTodayAndroidWidgetsModule.ts
export * from "./src/JustForTodayAndroidWidgets.types";
export { default } from "./src/JustForTodayAndroidWidgetsModule";
