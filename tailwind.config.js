const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: "class",
  content: ["./{app,components,features}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background),1)",
        border: "rgba(var(--border),1)",
        card: "rgba(var(--card),1)",
        notification: "rgba(var(--notification),1)",
        primary: "rgba(var(--primary),1)",
        text: "rgba(var(--text),1)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
