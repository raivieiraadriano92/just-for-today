import twColors from "tailwindcss/colors";
import { MoodType } from "./store/moodLogStore";

export const moodTypes: Record<
  MoodType,
  {
    value: number;
    icon: string;
    color: {
      token: keyof typeof twColors;
      light: keyof (typeof twColors)["amber"];
      dark: keyof (typeof twColors)["amber"];
    };
    feelings: string[];
    messageTitle: string;
    messageBody: string;
  }
> = {
  really_good: {
    value: 5,
    icon: "😄",
    color: {
      token: "green",
      light: "500",
      dark: "400",
    },
    feelings: [
      // Uplifting emotional states
      "joyful",
      "happy",
      "love",
      "playful",
      "connected",

      // Empowerment & confidence
      "proud",
      "brave",
      "confident",
      "free",
      "energetic",

      // Creative, inspired, poetic
      "creative",
      "excited",
      "elevated",
    ],
    messageTitle: "Joy is in the air",
    messageBody:
      "Something about today is lighting you up — let that warmth linger a little longer.",
  },
  good: {
    value: 4,
    icon: "🙂",
    color: {
      token: "lime",
      light: "500",
      dark: "400",
    },
    feelings: [
      // Calm and safe
      "calm",
      "peaceful",
      "safe",
      "comfortable",
      "balanced",
      "content",

      // Emotional and relational warmth
      "appreciated",
      "warm",
      "respected",
      "open",
      "grateful",

      // Curiosity and creativity
      "curious",
      "inspired",
      "recharged",

      // Motivation and positivity
      "motivated",
      "optimistic",
      "satisfied",
      "relieved",
    ],
    messageTitle: "A good rhythm",
    messageBody:
      "There’s a sense of ease in today. Let yourself move gently with it.",
  },
  okay: {
    value: 3,
    icon: "😐",
    color: {
      token: "yellow",
      light: "500",
      dark: "400",
    },
    feelings: [
      // Low energy / disengaged
      "meh",
      "flat",
      "blank",
      "dull",
      "bored",

      // Cognitive/emotional conflict
      "unsure",
      "confused",
      "awkward",
      "tired",

      // Distracted or tense
      "distracted",
      "impatient",
      "neutral",
    ],
    messageTitle: "A quiet middle",
    messageBody:
      "Not every day needs a peak. Showing up for the ordinary is powerful too.",
  },
  bad: {
    value: 2,
    icon: "🙁",
    color: {
      token: "orange",
      light: "500",
      dark: "400",
    },
    feelings: [
      // Demotivation, depletion
      "unmotivated",
      "exhausted",
      "discouraged",
      "unfulfilled",
      "restless",
      "tired",

      // Social/emotional pain
      "lonely",
      "isolated",
      "misunderstood",
      "hurt",
      "jealous",
      "insecure",
      "guilty",

      // Mental pressure and sadness
      "worried",
      "nervous",
      "overwhelmed",
      "pessimistic",
      "sad",

      // Reactivity / agitation
      "annoyed",
      "disappointed",
      "tense",
      "irritable",
      "stuck",
    ],
    messageTitle: "Waves come and go",
    messageBody:
      "This moment feels heavier — be soft with yourself and take it slow.",
  },
  really_bad: {
    value: 1,
    icon: "😞",
    color: {
      token: "red",
      light: "500",
      dark: "400",
    },
    feelings: [
      // Deep emotional pain
      "grieved",
      "hopeless",
      "worthless",
      "ashamed",
      "abandoned",

      // High emotional intensity
      "angry",
      "frustrated",
      "panicked",
      "fearful",
      "anxious",

      // Social rejection
      "rejected",
      "disrespected",
      "embarrassed",

      // Aversion / shutdown
      "numb",
      "disgusted",
    ],
    messageTitle: "A heavy sky",
    messageBody:
      "Today feels tough. Even noticing that is an act of care — maybe try writing one small thing you’re grateful for.",
  },
};

export const moodTypesList = Object.keys(moodTypes) as MoodType[];
