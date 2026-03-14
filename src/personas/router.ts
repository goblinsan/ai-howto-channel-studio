/**
 * Content-to-character routing rules and routing engine.
 *
 * Implements Issue #3: Create content-to-character routing rules.
 *
 * Maps topic categories and content keywords to the best-fit host persona.
 * Rules are ordered by priority (lower number = evaluated first). The router
 * scans rule keywords against the supplied topic string and returns the
 * highest-priority match along with a confidence score.
 */

import {
  ContentDomain,
  RoutingResult,
  RoutingRule,
} from "../types/persona";
import { characterRoster } from "./characters";

// ─── Routing rule definitions ─────────────────────────────────────────────────

/**
 * Ordered list of routing rules.  When multiple rules match, the one with the
 * lowest `priority` value wins.  Ties are broken by index order.
 */
export const routingRules: RoutingRule[] = [
  // ── Technology ──────────────────────────────────────────────────────────────
  {
    ruleId: "tech-001",
    description: "Software setup and installation guides",
    topicKeywords: [
      "install",
      "setup",
      "configure",
      "software",
      "app",
      "application",
      "download",
      "update",
    ],
    domain: "technology",
    characterId: "tara-chen",
    priority: 10,
  },
  {
    ruleId: "tech-002",
    description: "Coding and programming tutorials",
    topicKeywords: [
      "code",
      "coding",
      "programming",
      "script",
      "python",
      "javascript",
      "typescript",
      "html",
      "css",
      "api",
      "function",
      "loop",
      "variable",
    ],
    domain: "technology",
    characterId: "tara-chen",
    priority: 11,
  },
  {
    ruleId: "tech-003",
    description: "Smart home and device tutorials",
    topicKeywords: [
      "smart home",
      "wifi",
      "router",
      "bluetooth",
      "device",
      "phone",
      "computer",
      "laptop",
      "tablet",
      "printer",
      "troubleshoot",
    ],
    domain: "technology",
    characterId: "tara-chen",
    priority: 12,
  },
  {
    ruleId: "tech-004",
    description: "Cybersecurity and privacy guides",
    topicKeywords: [
      "password",
      "security",
      "privacy",
      "vpn",
      "firewall",
      "antivirus",
      "phishing",
      "backup",
    ],
    domain: "technology",
    characterId: "tara-chen",
    priority: 13,
  },

  // ── Cooking ─────────────────────────────────────────────────────────────────
  {
    ruleId: "cook-001",
    description: "Recipe and meal preparation tutorials",
    topicKeywords: [
      "recipe",
      "cook",
      "cooking",
      "bake",
      "baking",
      "meal",
      "dish",
      "food",
      "ingredient",
      "sauce",
      "soup",
      "salad",
    ],
    domain: "cooking",
    characterId: "kai-rivera",
    priority: 20,
  },
  {
    ruleId: "cook-002",
    description: "Kitchen technique guides",
    topicKeywords: [
      "chop",
      "dice",
      "slice",
      "julienne",
      "sauté",
      "braise",
      "grill",
      "roast",
      "fry",
      "boil",
      "simmer",
      "knife",
      "technique",
    ],
    domain: "cooking",
    characterId: "kai-rivera",
    priority: 21,
  },
  {
    ruleId: "cook-003",
    description: "Dietary and nutrition-friendly adaptations",
    topicKeywords: [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free",
      "keto",
      "paleo",
      "low-carb",
      "allergy",
      "substitute",
    ],
    domain: "cooking",
    characterId: "kai-rivera",
    priority: 22,
  },

  // ── Personal Finance ─────────────────────────────────────────────────────────
  {
    ruleId: "fin-001",
    description: "Budgeting and saving guides",
    topicKeywords: [
      "budget",
      "budgeting",
      "save",
      "saving",
      "expense",
      "spending",
      "money",
      "finance",
      "financial",
    ],
    domain: "personal-finance",
    characterId: "frank-okafor",
    priority: 30,
  },
  {
    ruleId: "fin-002",
    description: "Investing and retirement basics",
    topicKeywords: [
      "invest",
      "investing",
      "stock",
      "etf",
      "index fund",
      "401k",
      "ira",
      "retirement",
      "portfolio",
      "dividend",
    ],
    domain: "personal-finance",
    characterId: "frank-okafor",
    priority: 31,
  },
  {
    ruleId: "fin-003",
    description: "Debt and tax management",
    topicKeywords: [
      "debt",
      "credit card",
      "loan",
      "mortgage",
      "tax",
      "taxes",
      "irs",
      "deduction",
      "refund",
      "credit score",
    ],
    domain: "personal-finance",
    characterId: "frank-okafor",
    priority: 32,
  },

  // ── Home DIY ─────────────────────────────────────────────────────────────────
  {
    ruleId: "diy-001",
    description: "Home repair and maintenance tutorials",
    topicKeywords: [
      "repair",
      "fix",
      "diy",
      "home",
      "house",
      "plumbing",
      "leak",
      "pipe",
      "faucet",
      "drain",
      "caulk",
    ],
    domain: "home-diy",
    characterId: "dana-torres",
    priority: 40,
  },
  {
    ruleId: "diy-002",
    description: "Painting, finishing, and decorating",
    topicKeywords: [
      "paint",
      "painting",
      "primer",
      "wall",
      "ceiling",
      "stain",
      "varnish",
      "finish",
      "decor",
      "wallpaper",
    ],
    domain: "home-diy",
    characterId: "dana-torres",
    priority: 41,
  },
  {
    ruleId: "diy-003",
    description: "Organisation and furniture assembly",
    topicKeywords: [
      "organise",
      "organize",
      "storage",
      "furniture",
      "assemble",
      "assembly",
      "shelf",
      "shelving",
      "upcycle",
      "repurpose",
    ],
    domain: "home-diy",
    characterId: "dana-torres",
    priority: 42,
  },

  // ── Health & Fitness ─────────────────────────────────────────────────────────
  {
    ruleId: "fit-001",
    description: "Exercise and workout tutorials",
    topicKeywords: [
      "workout",
      "exercise",
      "fitness",
      "training",
      "gym",
      "bodyweight",
      "strength",
      "cardio",
      "run",
      "running",
      "yoga",
    ],
    domain: "health-fitness",
    characterId: "marcus-webb",
    priority: 50,
  },
  {
    ruleId: "fit-002",
    description: "Form, recovery, and injury prevention",
    topicKeywords: [
      "form",
      "posture",
      "stretch",
      "stretching",
      "warm up",
      "cool down",
      "recovery",
      "rest day",
      "injury",
      "muscle",
    ],
    domain: "health-fitness",
    characterId: "marcus-webb",
    priority: 51,
  },
  {
    ruleId: "fit-003",
    description: "Sleep, habits, and wellness",
    topicKeywords: [
      "sleep",
      "habit",
      "routine",
      "wellness",
      "health",
      "hydration",
      "nutrition basics",
      "mental health",
      "stress",
    ],
    domain: "health-fitness",
    characterId: "marcus-webb",
    priority: 52,
  },

  // ── Gardening ────────────────────────────────────────────────────────────────
  {
    ruleId: "gard-001",
    description: "Plant care and troubleshooting",
    topicKeywords: [
      "plant",
      "plants",
      "garden",
      "gardening",
      "grow",
      "growing",
      "soil",
      "water",
      "watering",
      "sunlight",
    ],
    domain: "gardening",
    characterId: "grace-nakamura",
    priority: 60,
  },
  {
    ruleId: "gard-002",
    description: "Composting and sustainable growing",
    topicKeywords: [
      "compost",
      "composting",
      "organic",
      "fertiliser",
      "fertilizer",
      "mulch",
      "worm",
      "sustainable",
      "eco",
    ],
    domain: "gardening",
    characterId: "grace-nakamura",
    priority: 61,
  },
  {
    ruleId: "gard-003",
    description: "Pest, disease, and seasonal guides",
    topicKeywords: [
      "pest",
      "bug",
      "insect",
      "disease",
      "fungus",
      "mould",
      "mold",
      "season",
      "spring",
      "summer",
      "autumn",
      "fall",
      "winter",
      "prune",
      "pruning",
    ],
    domain: "gardening",
    characterId: "grace-nakamura",
    priority: 62,
  },
];

// ─── Routing engine ───────────────────────────────────────────────────────────

/**
 * Normalises a topic string for keyword matching (lowercase, trimmed).
 */
function normaliseTopic(topic: string): string {
  return topic.toLowerCase().trim();
}

/**
 * Counts how many keywords from a rule appear in the normalised topic string.
 */
function countMatches(normalisedTopic: string, keywords: string[]): number {
  return keywords.filter((kw) => normalisedTopic.includes(kw)).length;
}

/**
 * Routes a topic description to the best-fit character.
 *
 * @param topic - Free-text description of the content topic
 * @returns The best-matching {@link RoutingResult}, or `null` if no rule matches
 */
export function routeTopicToCharacter(topic: string): RoutingResult | null {
  const normalised = normaliseTopic(topic);
  let bestRule: RoutingRule | null = null;
  let bestMatchCount = 0;

  for (const rule of routingRules) {
    const matches = countMatches(normalised, rule.topicKeywords);
    if (matches === 0) continue;

    const isBetter =
      matches > bestMatchCount ||
      (matches === bestMatchCount &&
        bestRule !== null &&
        rule.priority < bestRule.priority);

    if (isBetter) {
      bestMatchCount = matches;
      bestRule = rule;
    }
  }

  if (!bestRule) return null;

  const character = characterRoster[bestRule.characterId];
  if (!character) return null;

  // Confidence: ratio of matched keywords to total keywords in the winning rule
  const confidence = Math.min(
    bestMatchCount / bestRule.topicKeywords.length,
    1
  );

  return {
    characterId: bestRule.characterId,
    character,
    matchedRule: bestRule,
    confidence,
  };
}

/**
 * Returns all characters that can handle content in a given domain.
 *
 * @param domain - The {@link ContentDomain} to filter by
 * @returns Array of character ids serving the domain
 */
export function getCharactersForDomain(domain: ContentDomain): string[] {
  return [
    ...new Set(
      routingRules
        .filter((r) => r.domain === domain)
        .map((r) => r.characterId)
    ),
  ];
}

/**
 * Returns all routing rules for a specific character.
 *
 * @param characterId - The character identifier
 * @returns Rules assigned to that character, sorted by priority
 */
export function getRulesForCharacter(characterId: string): RoutingRule[] {
  return routingRules
    .filter((r) => r.characterId === characterId)
    .sort((a, b) => a.priority - b.priority);
}
