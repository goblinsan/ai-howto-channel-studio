/**
 * Persona QA checklist and evaluation engine.
 *
 * Implements Issue #4: Build persona QA checklist to prevent voice/tone drift.
 *
 * Provides a structured set of checks that must be run against every script or
 * content piece before production.  Blocking checks must all pass before a
 * script is approved; non-blocking checks produce warnings only.
 */

import {
  PersonaQAReport,
  QACheckCategory,
  QACheckItem,
  QACheckResult,
} from "../types/persona";
import { characterRoster } from "./characters";

// ─── Master checklist ─────────────────────────────────────────────────────────

/**
 * The canonical list of QA checks applied to every script.
 * Blocking checks (`isBlocking: true`) prevent production approval if failed.
 */
export const personaQAChecklist: QACheckItem[] = [
  // ── Tone consistency ────────────────────────────────────────────────────────
  {
    checkId: "tone-001",
    category: "tone-consistency",
    description: "Script tone matches the character's defined tone style",
    passCriteria:
      "The script's language, sentence structure, and register align with the character's assigned tone (e.g. professional, enthusiastic, analytical).",
    isBlocking: true,
  },
  {
    checkId: "tone-002",
    category: "tone-consistency",
    description: "Tone remains consistent throughout the entire script",
    passCriteria:
      "No section of the script shifts to a noticeably different register or emotional tone without intentional stylistic reason.",
    isBlocking: true,
  },
  {
    checkId: "tone-003",
    category: "tone-consistency",
    description: "Opening hook matches the character's energy level",
    passCriteria:
      "The first 15 seconds of the script reflect the character's typical energy (e.g. calm and measured for Tara, energetic and direct for Marcus).",
    isBlocking: false,
  },

  // ── Vocabulary ──────────────────────────────────────────────────────────────
  {
    checkId: "vocab-001",
    category: "vocabulary",
    description: "Domain-specific vocabulary is appropriate and explained",
    passCriteria:
      "Technical or specialised terms are used correctly and each is immediately followed by a plain-language definition on first use.",
    isBlocking: true,
  },
  {
    checkId: "vocab-002",
    category: "vocabulary",
    description: "No filler phrases or cross-character vocabulary used",
    passCriteria:
      "Script does not include catch-phrases, idioms, or vocabulary signatures belonging to a different character persona.",
    isBlocking: false,
  },
  {
    checkId: "vocab-003",
    category: "vocabulary",
    description: "Calls-to-action (CTAs) match the character's voice",
    passCriteria:
      "CTAs and sign-offs use language consistent with the character's personality (e.g. 'Let me know in the comments' for Kai vs 'Share your results' for Marcus).",
    isBlocking: false,
  },

  // ── Expertise boundary ──────────────────────────────────────────────────────
  {
    checkId: "boundary-001",
    category: "expertise-boundary",
    description: "Script stays within the character's defined expertise areas",
    passCriteria:
      "All claims, demonstrations, and advice fall within the character's documented expertise areas. No out-of-domain claims are made.",
    isBlocking: true,
  },
  {
    checkId: "boundary-002",
    category: "expertise-boundary",
    description: "Expertise boundary topics include appropriate disclaimers",
    passCriteria:
      "Any topic that approaches an expertise boundary (e.g. health claims for Marcus, investment returns for Frank) includes a standard disclaimer.",
    isBlocking: true,
  },
  {
    checkId: "boundary-003",
    category: "expertise-boundary",
    description: "No claims outside the character's defined expertise boundaries",
    passCriteria:
      "The script does not venture into topics explicitly listed in the character's expertiseBoundaries field.",
    isBlocking: true,
  },

  // ── Visual identity ─────────────────────────────────────────────────────────
  {
    checkId: "visual-001",
    category: "visual-identity",
    description: "B-roll and on-screen asset requests match the character's setting",
    passCriteria:
      "Any scene descriptions or B-roll requests in the script align with the character's backgroundScene and wardrobeNotes in the style guide.",
    isBlocking: false,
  },
  {
    checkId: "visual-002",
    category: "visual-identity",
    description: "Brand color references are consistent with the character's palette",
    passCriteria:
      "Lower-thirds, text overlays, and graphic element color instructions reference the character's primaryColor and secondaryColor.",
    isBlocking: false,
  },

  // ── Delivery style ──────────────────────────────────────────────────────────
  {
    checkId: "delivery-001",
    category: "delivery-style",
    description: "Pacing cues are present and match the character's voice settings",
    passCriteria:
      "The script includes pause markers or pacing notes where appropriate, consistent with the character's voiceSettings.rate.",
    isBlocking: false,
  },
  {
    checkId: "delivery-002",
    category: "delivery-style",
    description: "Emphasis markers align with the character's delivery notes",
    passCriteria:
      "Words or phrases intended to be stressed are marked and match the emotional emphasis patterns described in the character's deliveryNotes.",
    isBlocking: false,
  },
  {
    checkId: "delivery-003",
    category: "delivery-style",
    description: "Script length is appropriate for the character's delivery pace",
    passCriteria:
      "Estimated speaking duration (word count / speaking rate) falls within the target video length for the channel vertical.",
    isBlocking: false,
  },

  // ── Audience alignment ──────────────────────────────────────────────────────
  {
    checkId: "audience-001",
    category: "audience-alignment",
    description: "Assumed knowledge level matches the character's audience level",
    passCriteria:
      "The script does not assume knowledge beyond what the character's audienceLevel indicates (e.g. no advanced jargon for beginner-targeted characters without explanation).",
    isBlocking: true,
  },
  {
    checkId: "audience-002",
    category: "audience-alignment",
    description: "Inclusivity and accessibility language is used",
    passCriteria:
      "Script uses inclusive language, avoids assumptions about demographics, and does not alienate segments of the target audience.",
    isBlocking: false,
  },
];

// ─── Checklist helpers ────────────────────────────────────────────────────────

/**
 * Returns all QA checks for a given category.
 */
export function getChecksByCategory(
  category: QACheckCategory
): QACheckItem[] {
  return personaQAChecklist.filter((c) => c.category === category);
}

/**
 * Returns only blocking QA checks.
 */
export function getBlockingChecks(): QACheckItem[] {
  return personaQAChecklist.filter((c) => c.isBlocking);
}

// ─── QA evaluation engine ─────────────────────────────────────────────────────

/**
 * Runs a pre-supplied set of check results against the canonical checklist to
 * produce a {@link PersonaQAReport}.
 *
 * In production this function would be called after an LLM or human reviewer
 * has assessed each check.  Here it validates the supplied results for
 * completeness and computes the overall pass/fail.
 *
 * @param characterId - The character the content was written for
 * @param contentTitle - Title of the script/content piece being reviewed
 * @param results - Reviewer-supplied result for each check
 * @returns A fully populated {@link PersonaQAReport}
 * @throws {Error} if `characterId` is not found in the roster
 * @throws {Error} if `results` contains an unknown checkId
 */
export function evaluatePersonaQA(
  characterId: string,
  contentTitle: string,
  results: QACheckResult[]
): PersonaQAReport {
  if (!characterRoster[characterId]) {
    throw new Error(
      `Unknown characterId "${characterId}". Valid ids: ${Object.keys(characterRoster).join(", ")}`
    );
  }

  const validCheckIds = new Set(personaQAChecklist.map((c) => c.checkId));
  for (const result of results) {
    if (!validCheckIds.has(result.checkId)) {
      throw new Error(`Unknown checkId "${result.checkId}" in supplied results.`);
    }
  }

  const resultMap = new Map(results.map((r) => [r.checkId, r]));
  const failureSummary: string[] = [];
  let passed = true;

  for (const check of personaQAChecklist) {
    const result = resultMap.get(check.checkId);
    if (!result) continue; // Unchecked items are skipped (treated as N/A)

    if (!result.passed && check.isBlocking) {
      passed = false;
      const note = result.notes ? ` — ${result.notes}` : "";
      failureSummary.push(`[BLOCKING] ${check.checkId}: ${check.description}${note}`);
    } else if (!result.passed) {
      const note = result.notes ? ` — ${result.notes}` : "";
      failureSummary.push(`[WARNING] ${check.checkId}: ${check.description}${note}`);
    }
  }

  return {
    characterId,
    contentTitle,
    checkedAt: new Date(),
    results,
    passed,
    failureSummary,
  };
}
