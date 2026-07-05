/**
 * suggestions.js
 * ─────────────────────────────────────────────────────────────────────
 * A small library of supportive, non-clinical suggestions keyed by
 * factor. The engine surfaces suggestions for whichever factors scored
 * worst, so advice is always personalized to the individual's weakest
 * areas. Language is deliberately supportive and educational — never
 * diagnostic.
 *
 * NOTE: keys are camelCase now (studyPressure, socialSupport, ...) —
 * there's no more database schema dictating snake_case column names,
 * so this file (and every other file in src/ai/) uses one consistent,
 * JS-idiomatic naming convention throughout.
 */

export const SUGGESTION_LIBRARY = {
  sleep: {
    title: "Improve sleep",
    text: "Aim for a consistent sleep and wake time, and wind down screen-free for 30 minutes before bed. Quality sleep is one of the strongest protectors of mood and focus.",
  },
  stress: {
    title: "Manage stress",
    text: "Try short, regular breaks and a simple breathing exercise (inhale 4s, hold 4s, exhale 6s). Breaking big tasks into smaller steps can also lower the pressure.",
  },
  anxiety: {
    title: "Ease anxiety",
    text: "Grounding techniques — naming five things you can see, four you can hear — can calm an anxious moment. Writing worries down often makes them feel more manageable.",
  },
  mood: {
    title: "Lift your mood",
    text: "Small wins help: a short walk, sunlight, or a chat with someone you trust. Doing one enjoyable thing each day, even briefly, supports a steadier mood.",
  },
  studyPressure: {
    title: "Handle study pressure",
    text: "A realistic schedule with built-in rest beats cramming. Prioritize the few tasks that matter most today, and let 'good enough' be okay for the rest.",
  },
  socialSupport: {
    title: "Strengthen connection",
    text: "Reaching out matters. Message one friend, join a study group, or talk to a mentor or counselor. Connection is a powerful buffer against stress.",
  },
  concentration: {
    title: "Sharpen focus",
    text: "Try focused 25-minute blocks with short breaks, and remove easy distractions (silence notifications). Focus tends to recover as sleep and stress improve.",
  },
  screenTime: {
    title: "Balance screen time",
    text: "Consider gentle limits on late-night scrolling and social media. Swapping some screen time for movement or rest can noticeably help mood and sleep.",
  },
  physicalActivity: {
    title: "Move a little more",
    text: "Even a 10–15 minute daily walk can reduce stress and improve sleep and mood. Movement you enjoy is the kind most likely to stick.",
  },
  overwhelmed: {
    title: "When it feels like too much",
    text: "Pause and offload: list everything on your mind, then pick just the next single step. Asking for help early keeps overwhelm from building.",
  },
};

// A positive note shown when someone is doing well overall.
export const POSITIVE_NOTE = {
  title: "Keep it up",
  text: "Your responses suggest healthy balance across most areas. Maintaining sleep, movement, and connection will help you stay well.",
};

// Always-present, non-clinical disclaimer for any results view.
export const DISCLAIMER =
  "This is not a diagnostic tool. Please consult a professional for personal concerns.";
