/**
 * questions.js
 * ─────────────────────────────────────────────────────────────────────
 * The 10 screening questions. Each is answered on a 0–4 scale, and every
 * question's options are deliberately worded so that a HIGHER number
 * always means MORE concern — regardless of topic. That single rule
 * replaces the old "direction: high_bad / low_bad" flag entirely: there
 * is nothing left to get backwards, which removes a whole class of bug.
 *
 * `options` are shown in the UI in order; their array index IS the
 * answer value (0-4), so option 0 is always the healthiest response and
 * option 4 is always the most concerning one.
 */

export const QUESTIONS = [
  {
    key: "sleep",
    label: "How would you rate your sleep quality recently?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
  },
  {
    key: "stress",
    label: "What is your general stress level these days?",
    options: ["None", "Mild", "Moderate", "High", "Extreme"],
  },
  {
    key: "anxiety",
    label: "How often do you feel anxious or on edge?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
  },
  {
    key: "mood",
    label: "How often have you felt down, low, or discouraged?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
  },
  {
    key: "studyPressure",
    label: "How much pressure do you feel from your studies right now?",
    options: ["None", "A little", "Some", "A lot", "Crushing"],
  },
  {
    key: "socialSupport",
    label: "How supported do you feel by friends, family, or peers?",
    options: ["Very supported", "Supported", "Somewhat", "Not much", "Not at all"],
  },
  {
    key: "concentration",
    label: "How well have you been able to concentrate and focus?",
    options: ["Very well", "Well", "Okay", "Poorly", "Cannot focus"],
  },
  {
    key: "screenTime",
    label: "How would you rate your daily screen time (social media, phone)?",
    options: ["Very low", "Low", "Moderate", "High", "Very high"],
  },
  {
    key: "physicalActivity",
    label: "How physically active have you been lately?",
    options: ["Very active", "Active", "Somewhat active", "Rarely active", "Not active"],
  },
  {
    key: "overwhelmed",
    label: "How often have you felt overwhelmed by your responsibilities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
  },
];

export const QUESTION_KEYS = QUESTIONS.map((q) => q.key);

/** Each question is answered 0-4, so the maximum possible raw sum is
 *  exactly QUESTIONS.length * 4. The scoring engine uses this constant
 *  to linearly map the raw sum onto a 0-100 score. */
export const MAX_ANSWER_VALUE = 4;
export const MAX_RAW_SCORE = QUESTIONS.length * MAX_ANSWER_VALUE;
