/**
 * Core TypeScript interfaces and types for AI host character personas.
 * Supports the Avatar Character Roster and Persona Design system.
 */

/** Primary content domains / how-to verticals */
export type ContentDomain =
  | "technology"
  | "cooking"
  | "personal-finance"
  | "home-diy"
  | "health-fitness"
  | "gardening";

/** Audience experience level a character targets */
export type AudienceLevel = "beginner" | "intermediate" | "advanced" | "all-levels";

/** Overall delivery tone of the host */
export type ToneStyle =
  | "professional"
  | "enthusiastic"
  | "analytical"
  | "practical"
  | "motivational"
  | "nurturing";

/** Pacing / energy of on-screen delivery */
export type DeliveryPace = "slow" | "moderate" | "fast";

/** Voice gender presentation used by TTS / avatar engine */
export type VoiceGender = "male" | "female" | "neutral";

/** Avatar visual style preset */
export type AvatarStyle = "professional" | "casual" | "athletic" | "natural";

/**
 * Core persona definition for a specialist AI host character.
 * Addresses Issue #1: Define 4-6 specialist characters.
 */
export interface CharacterPersona {
  /** Unique machine-readable identifier */
  id: string;
  /** Display name of the character */
  name: string;
  /** Short tagline used in channel branding */
  tagline: string;
  /** Primary content domain this character covers */
  domain: ContentDomain;
  /** Topics this character is authoritative on */
  expertiseAreas: string[];
  /** Topics strictly outside this character's scope */
  expertiseBoundaries: string[];
  /** Intended target audience experience level */
  audienceLevel: AudienceLevel;
  /** Primary tone of the character's delivery */
  tone: ToneStyle;
  /** Personality traits that define voice and approach */
  personalityTraits: string[];
  /** Visual and voice style guide for this character */
  styleGuide: AvatarStyleGuide;
}

/**
 * Visual identity and voice configuration for an AI avatar character.
 * Addresses Issue #2: Design avatar/voice style guide per character.
 */
export interface AvatarStyleGuide {
  /** Avatar visual appearance preset */
  avatarStyle: AvatarStyle;
  /** Primary brand color (hex) */
  primaryColor: string;
  /** Secondary brand color (hex) */
  secondaryColor: string;
  /** Background scene / set description */
  backgroundScene: string;
  /** Signature wardrobe or visual element */
  wardrobeNotes: string;
  /** TTS voice configuration */
  voiceSettings: VoiceSettings;
  /** On-screen delivery style notes */
  deliveryNotes: string;
}

/**
 * Text-to-speech voice configuration parameters.
 */
export interface VoiceSettings {
  /** Gender presentation of the synthesised voice */
  gender: VoiceGender;
  /** Speech rate: 0.5 (slow) – 2.0 (fast), default 1.0 */
  rate: number;
  /** Pitch adjustment: -20 to +20 semitones, default 0 */
  pitchSemitones: number;
  /** Volume gain in dB, typically 0 */
  volumeGainDb: number;
  /** Preferred TTS voice identifier/name */
  voiceId: string;
}

/**
 * A topic-category-to-character routing rule.
 * Addresses Issue #3: Content-to-character routing rules.
 */
export interface RoutingRule {
  /** Unique identifier for this rule */
  ruleId: string;
  /** Human-readable description of the rule */
  description: string;
  /** Topic keywords that trigger this rule */
  topicKeywords: string[];
  /** The domain this rule maps to */
  domain: ContentDomain;
  /** The character id this rule routes to */
  characterId: string;
  /** Routing priority; lower number = higher priority */
  priority: number;
}

/**
 * Result from routing a topic to a character.
 */
export interface RoutingResult {
  /** The matched character id */
  characterId: string;
  /** The matched character persona */
  character: CharacterPersona;
  /** The rule that produced this match */
  matchedRule: RoutingRule;
  /** Confidence score 0–1 */
  confidence: number;
}

/**
 * A single QA check item in the persona consistency checklist.
 * Addresses Issue #4: Persona QA checklist to prevent voice/tone drift.
 */
export interface QACheckItem {
  /** Unique identifier for this check */
  checkId: string;
  /** Category grouping (e.g. "tone", "vocabulary", "visual") */
  category: QACheckCategory;
  /** Description of what is being checked */
  description: string;
  /** Pass criteria */
  passCriteria: string;
  /** Whether this check is blocking (script cannot proceed if failed) */
  isBlocking: boolean;
}

/** High-level categories for QA checks */
export type QACheckCategory =
  | "tone-consistency"
  | "vocabulary"
  | "expertise-boundary"
  | "visual-identity"
  | "delivery-style"
  | "audience-alignment";

/**
 * The result of running a QA check against a script or content piece.
 */
export interface QACheckResult {
  checkId: string;
  passed: boolean;
  notes?: string;
}

/**
 * Full QA report for a content piece mapped to a character.
 */
export interface PersonaQAReport {
  characterId: string;
  contentTitle: string;
  checkedAt: Date;
  results: QACheckResult[];
  /** Overall pass/fail — false if any blocking check failed */
  passed: boolean;
  /** Summary of any failures */
  failureSummary: string[];
}
