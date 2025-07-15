# 🌞 Just for Today — Daily Intention & Mood Tracker

**Just for Today** is a beautifully designed, offline-first mobile app focused on emotional well-being and mindfulness. Inspired by the poem _Just for Today_ by Sybil F. Partridge, the app helps users live one day at a time with intention, emotional clarity, and gratitude.

![Just for Today Logo](./assets/images/logo.png)

---

## ✨ Features

Just for Today is built around a daily ritual of self-awareness and emotional care:

### 🌼 1. Daily Intention

Set a gentle, personal commitment like “Today I’ll be kind to myself” or “Today I won’t rush.” This small act of self-direction starts the day with clarity and meaning.

### 🧠 2. Mood Logging

Track how you're feeling with a two-step mood log:

- Choose a **primary mood** (e.g. Fantastic, Good, Meh, Not Good, Terrible)
- Select **secondary feelings** to better understand your emotional landscape
- Optionally, add a **note** to describe why you're feeling this way

### 🙏 3. Gratitude Practice

Right after logging your mood, reflect on what you’re grateful for. This scientifically backed practice improves mood and nurtures perspective.

### 📓 4. Evening Reflection

At the end of the day, write a short journal reflection. Review your mood again if you’d like, and close the day with emotional clarity.

---

## 🔔 Gentle Notifications

The app sends three friendly nudges:

- **Morning** – Start your day with intention, mood check, and gratitude
- **Afternoon** – A soft reminder to revisit your intention
- **Evening** – Wind down with reflection and gratitude

---

## 📊 Insights

Visualize your emotional journey with:

- Mood trends and distribution
- Mood by time of day or weekday
- Streaks and weekly progress
- Gratitude and reflection patterns

---

## 🛠 Tech Stack

Just for Today is built with:

- **React Native** + **TypeScript**
- **Expo** (offline-ready and performant)
- **Drizzle ORM + SQLite (expo-sqlite)** for local-first data storage
- **Zustand** for state management
- **NativeWind + TailwindCSS** for styling
- **Expo Router** for navigation

Offline-first, fast, and private by design.

---

## 🧠 Architecture Overview

The app is structured by features:  
Each major domain (intention, mood, gratitude, reflection, user) includes:

- **Screens** — powered by `expo-router` with success and form flows
- **Components** — form providers, display widgets, etc.
- **Stores** — Zustand-powered state management with async persistence
- **Utils** — including mock data generators for development/testing

Key folders:

- `app/`: route-based navigation using expo-router
- `features/`: isolated logic and UI per feature
- `db/`: drizzle schema and client
- `components/ui/`: shared UI primitives
- `i18n/`: internationalization setup for EN, PT-BR, ES

---

## 🌍 Multilingual

- 🇺🇸 English
- 🇧🇷 Português
- 🇪🇸 Español  
  More languages to come!

---

## 🔒 Privacy-First

Just for Today is **private by design**. All your data stays on your device.  
No ads. No data mining. Ever.  
We may offer an optional premium subscription in the future for AI-based insights — but your privacy will always come first.

---

## 📦 Dependencies Highlights

- **Navigation**: `expo-router`, `react-navigation`
- **Charts**: `react-native-svg-charts`, `gifted-charts`
- **Animation/UI**: `react-native-reanimated`, `expo-blur`, `expo-haptics`
- **Offline-first DB**: `drizzle-orm`, `expo-sqlite`
- **Storage**: `expo-file-system`, `@react-native-async-storage/async-storage`
- **State**: `zustand`
- **Localization**: `i18next`, `react-i18next`, `expo-localization`
- **UI**: `nativewind`, `@expo/vector-icons`, `react-native-skia`
- **Performance**: `@shopify/flash-list`

---

## 📱 iOS Widgets (Coming Soon)

Show your daily intention right on your home screen. If no intention is set, you’ll get a warm reminder.

---

## 🚧 Development

This project uses:

- **Expo Dev Client**
- **Drizzle Studio Plugin** for local schema browsing
- **Babel inline import** for loading `.svg` files
- **EventEmitter** for inter-component communication
- **Sentry** for error tracking (optional)

---

## 🤍 License

Free forever. No ads. Open-hearted and built to help.

---

## 🙌 Contributing

Want to help more people live one mindful day at a time?  
Pull requests are welcome. Let's build something meaningful together.
