/**
 * Tests for the content-to-character routing engine (Issue #3).
 */

import {
  routingRules,
  routeTopicToCharacter,
  getCharactersForDomain,
  getRulesForCharacter,
} from "../personas/router";
import { ContentDomain } from "../types/persona";

// ─── Routing rule integrity ───────────────────────────────────────────────────

describe("Routing rules", () => {
  it("defines at least one rule per domain", () => {
    const domains: ContentDomain[] = [
      "technology",
      "cooking",
      "personal-finance",
      "home-diy",
      "health-fitness",
      "gardening",
    ];
    for (const domain of domains) {
      const rules = routingRules.filter((r) => r.domain === domain);
      expect(rules.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has no duplicate ruleIds", () => {
    const ids = routingRules.map((r) => r.ruleId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rule has at least one keyword", () => {
    for (const rule of routingRules) {
      expect(rule.topicKeywords.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every rule references a valid characterId", () => {
    const validIds = [
      "tara-chen",
      "kai-rivera",
      "frank-okafor",
      "dana-torres",
      "marcus-webb",
      "grace-nakamura",
    ];
    for (const rule of routingRules) {
      expect(validIds).toContain(rule.characterId);
    }
  });

  it("every rule has a positive priority", () => {
    for (const rule of routingRules) {
      expect(rule.priority).toBeGreaterThan(0);
    }
  });
});

// ─── routeTopicToCharacter ────────────────────────────────────────────────────

describe("routeTopicToCharacter", () => {
  it("routes a tech topic to Tara Chen", () => {
    const result = routeTopicToCharacter("How to install Python on Windows");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("tara-chen");
  });

  it("routes a cooking topic to Kai Rivera", () => {
    const result = routeTopicToCharacter("Easy weeknight pasta recipe");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("kai-rivera");
  });

  it("routes a finance topic to Frank Okafor", () => {
    const result = routeTopicToCharacter("How to start budgeting your money");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("frank-okafor");
  });

  it("routes a DIY topic to Dana Torres", () => {
    const result = routeTopicToCharacter("How to fix a leaky faucet at home");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("dana-torres");
  });

  it("routes a fitness topic to Marcus Webb", () => {
    const result = routeTopicToCharacter("Best bodyweight workout for beginners");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("marcus-webb");
  });

  it("routes a gardening topic to Grace Nakamura", () => {
    const result = routeTopicToCharacter("How to start composting in your garden");
    expect(result).not.toBeNull();
    expect(result!.characterId).toBe("grace-nakamura");
  });

  it("returns null for an unrelated topic", () => {
    const result = routeTopicToCharacter("xyzzyx123 completely unrelated content");
    expect(result).toBeNull();
  });

  it("is case-insensitive", () => {
    const lower = routeTopicToCharacter("how to install software");
    const upper = routeTopicToCharacter("How To INSTALL Software");
    expect(lower?.characterId).toBe(upper?.characterId);
  });

  it("returns a confidence score between 0 and 1", () => {
    const result = routeTopicToCharacter("beginner workout exercise routine");
    expect(result).not.toBeNull();
    expect(result!.confidence).toBeGreaterThan(0);
    expect(result!.confidence).toBeLessThanOrEqual(1);
  });

  it("returns the full character persona in the result", () => {
    const result = routeTopicToCharacter("plant watering schedule");
    expect(result).not.toBeNull();
    expect(result!.character).toBeDefined();
    expect(result!.character.id).toBe(result!.characterId);
  });

  it("returns the matched rule in the result", () => {
    const result = routeTopicToCharacter("python coding tutorial");
    expect(result).not.toBeNull();
    expect(result!.matchedRule).toBeDefined();
    expect(result!.matchedRule.domain).toBe("technology");
  });
});

// ─── getCharactersForDomain ───────────────────────────────────────────────────

describe("getCharactersForDomain", () => {
  it("returns tara-chen for technology", () => {
    expect(getCharactersForDomain("technology")).toContain("tara-chen");
  });

  it("returns kai-rivera for cooking", () => {
    expect(getCharactersForDomain("cooking")).toContain("kai-rivera");
  });

  it("returns no duplicates", () => {
    const ids = getCharactersForDomain("technology");
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── getRulesForCharacter ─────────────────────────────────────────────────────

describe("getRulesForCharacter", () => {
  it("returns rules for a valid character", () => {
    const rules = getRulesForCharacter("kai-rivera");
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.characterId).toBe("kai-rivera");
    }
  });

  it("returns rules sorted by priority (ascending)", () => {
    const rules = getRulesForCharacter("tara-chen");
    for (let i = 1; i < rules.length; i++) {
      expect(rules[i].priority).toBeGreaterThanOrEqual(rules[i - 1].priority);
    }
  });

  it("returns empty array for unknown character", () => {
    const rules = getRulesForCharacter("unknown-character-id");
    expect(rules).toHaveLength(0);
  });
});
