/**
 * ai-howto-channel-studio
 *
 * Public API for the Avatar Character Roster and Persona Design system.
 *
 * Usage:
 *   import { characters, routeTopicToCharacter, evaluatePersonaQA } from './index';
 */

// Types
export * from "./types/persona";

// Character roster & style guides
export {
  characters,
  characterRoster,
  taraChen,
  kaiRivera,
  frankOkafor,
  danaTorres,
  marcusWebb,
  graceNakamura,
} from "./personas/characters";

// Content-to-character routing
export {
  routingRules,
  routeTopicToCharacter,
  getCharactersForDomain,
  getRulesForCharacter,
} from "./personas/router";

// Persona QA checklist
export {
  personaQAChecklist,
  getChecksByCategory,
  getBlockingChecks,
  evaluatePersonaQA,
} from "./personas/qaChecklist";
