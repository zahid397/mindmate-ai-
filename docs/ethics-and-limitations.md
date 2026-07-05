# Ethics & Limitations

MindMate AI is built as an **educational wellbeing screening tool**, not a clinical instrument. This document states plainly what it is, what it is not, and the safeguards built into the design.

## What this tool is

- A structured way for students to reflect on how they've been feeling across ten everyday areas (sleep, stress, anxiety, mood, study pressure, social support, concentration, screen time, physical activity, feeling overwhelmed).
- A prompt for self-awareness and, where helpful, a gentle nudge to reach out for support.
- A transparent, rule-based system whose logic can be read and explained line by line.

## What this tool is NOT

- **Not a diagnosis.** It does not identify, label, or rule out any mental health condition.
- **Not a substitute for professional care.** A score is not a clinical assessment.
- **Not a crisis service.** It cannot detect emergencies or intervene.

The interface deliberately uses the language of *screening* and *wellbeing support*, never *diagnosis*. A disclaimer appears on the home page, the result page, the dashboard footer area, and the about page.

## Design safeguards

- **Non-clinical language** throughout suggestions and risk bands ("Low / Moderate / Stress / High Risk" describe screening ranges, not diagnoses).
- **Supportive framing**: results lead with encouragement where appropriate and always point toward human support for higher ranges.
- **Privacy by design**: students see only their own data (filtered by user id); the admin view reads only aggregate counts, computed directly from the same local dataset, never names or emails. There is no external server at all in this demo build — see "Known limitations" below for what that trades away.
- **No dark patterns**: no pressure to share, no manipulative copy, no engagement loops. The goal is reflection, not retention.

## Known limitations

1. **Self-report bias** — answers reflect a moment and a mood; they can over- or under-state how someone is doing.
2. **Rule-based, not validated** — every question counts equally in a simple linear sum; the scale is clinically *inspired* but is not a validated psychometric instrument. It is intended for awareness, not measurement.
3. **No clinical oversight** — there is no professional reviewing results in the loop.
4. **Cultural and language scope** — the questions and suggestions are general and may not fit every context.
5. **Point-in-time** — a single screening is a snapshot; trends over many check-ins are more meaningful than any one score.
6. **Demo-only storage** — this build has no server or database. Everything lives in the browser's localStorage: it isn't backed up, doesn't sync across devices, and is visible to anyone with access to that browser (including passwords, stored in plain text since there is nothing to hash them against). Do not enter real sensitive information.

## Responsible-use guidance

- Present the tool to students as a starting point for reflection, paired with real support options (campus counseling, trusted people, local helplines — see the About page).
- Never use scores to rank, label, or make decisions about individuals.
- If deployed at an institution, route higher-range results toward human support resources, and make crisis contacts prominent.

## Crisis note

If you or someone you know is in immediate danger or crisis, contact local emergency services or a mental health helpline right away. MindMate AI cannot help in an emergency.
