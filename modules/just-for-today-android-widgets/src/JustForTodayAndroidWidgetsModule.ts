import { requireNativeModule } from "expo";
import type { JustForTodayAndroidWidgetsModule } from "./JustForTodayAndroidWidgets.types";

// Loads the native module from the JavaScript interface (via JSI bridge)
export default requireNativeModule<JustForTodayAndroidWidgetsModule>(
  "JustForTodayAndroidWidgets",
);
