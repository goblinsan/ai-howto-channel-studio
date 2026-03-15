/**
 * Tests for specialist character persona definitions (Issue #1) and
 * avatar/voice style guides (Issue #2).
 */

import {
  characters,
  characterRoster,
  taraChen,
  kaiRivera,
  frankOkafor,
  danaTorres,
  marcusWebb,
  graceNakamura,
} from "../personas/characters";
import {
  CharacterPersona,
  ContentDomain,
  ToneStyle,
} from "../types/persona";

// ─── Roster completeness ──────────────────────────────────────────────────────

describe("Character roster", () => {
  it("defines between 4 and 6 specialist characters", () => {
    expect(characters.length).toBeGreaterThanOrEqual(4);
    expect(characters.length).toBeLessThanOrEqual(6);
  });

  it("includes all six expected characters", () => {
    const ids = characters.map((c) => c.id);
    expect(ids).toContain("tara-chen");
    expect(ids).toContain("kai-rivera");
    expect(ids).toContain("frank-okafor");
    expect(ids).toContain("dana-torres");
    expect(ids).toContain("marcus-webb");
    expect(ids).toContain("grace-nakamura");
  });

  it("stores characters in the roster map keyed by id", () => {
    for (const character of characters) {
      expect(characterRoster[character.id]).toBe(character);
    }
  });

  it("has no duplicate character ids", () => {
    const ids = characters.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has no duplicate content domains", () => {
    const domains = characters.map((c) => c.domain);
    const unique = new Set(domains);
    expect(unique.size).toBe(domains.length);
  });
});

// ─── Persona field validation ─────────────────────────────────────────────────

describe.each(characters)("CharacterPersona: $name", (character: CharacterPersona) => {
  it("has a non-empty id", () => {
    expect(character.id.trim()).not.toBe("");
  });

  it("has a non-empty name", () => {
    expect(character.name.trim()).not.toBe("");
  });

  it("has a non-empty tagline", () => {
    expect(character.tagline.trim()).not.toBe("");
  });

  it("has at least three expertise areas", () => {
    expect(character.expertiseAreas.length).toBeGreaterThanOrEqual(3);
  });

  it("has at least one expertise boundary", () => {
    expect(character.expertiseBoundaries.length).toBeGreaterThanOrEqual(1);
  });

  it("has no overlap between expertise areas and boundaries", () => {
    const areasLower = character.expertiseAreas.map((a) => a.toLowerCase());
    const boundariesLower = character.expertiseBoundaries.map((b) => b.toLowerCase());
    const overlap = areasLower.filter((a) => boundariesLower.includes(a));
    expect(overlap).toHaveLength(0);
  });

  it("has at least two personality traits", () => {
    expect(character.personalityTraits.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── Style guide field validation ────────────────────────────────────────────

describe.each(characters)(
  "AvatarStyleGuide: $name",
  (character: CharacterPersona) => {
    const { styleGuide } = character;

    it("has valid hex primary color", () => {
      expect(styleGuide.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("has valid hex secondary color", () => {
      expect(styleGuide.secondaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("has non-empty background scene", () => {
      expect(styleGuide.backgroundScene.trim()).not.toBe("");
    });

    it("has non-empty wardrobe notes", () => {
      expect(styleGuide.wardrobeNotes.trim()).not.toBe("");
    });

    it("has non-empty delivery notes", () => {
      expect(styleGuide.deliveryNotes.trim()).not.toBe("");
    });

    describe("VoiceSettings", () => {
      const { voiceSettings } = styleGuide;

      it("has a non-empty voiceId", () => {
        expect(voiceSettings.voiceId.trim()).not.toBe("");
      });

      it("has a speech rate between 0.5 and 2.0", () => {
        expect(voiceSettings.rate).toBeGreaterThanOrEqual(0.5);
        expect(voiceSettings.rate).toBeLessThanOrEqual(2.0);
      });

      it("has pitch within ±20 semitones", () => {
        expect(voiceSettings.pitchSemitones).toBeGreaterThanOrEqual(-20);
        expect(voiceSettings.pitchSemitones).toBeLessThanOrEqual(20);
      });
    });
  }
);

// ─── Individual character spot-checks ────────────────────────────────────────

describe("Tara Chen – Technology specialist", () => {
  it("is in the technology domain", () => {
    expect(taraChen.domain).toBe<ContentDomain>("technology");
  });

  it("has a professional tone", () => {
    expect(taraChen.tone).toBe<ToneStyle>("professional");
  });

  it("excludes hardware manufacturing from expertise", () => {
    const hasExclusion = taraChen.expertiseBoundaries.some((b) =>
      b.toLowerCase().includes("hardware")
    );
    expect(hasExclusion).toBe(true);
  });
});

describe("Kai Rivera – Cooking specialist", () => {
  it("is in the cooking domain", () => {
    expect(kaiRivera.domain).toBe<ContentDomain>("cooking");
  });

  it("has an enthusiastic tone", () => {
    expect(kaiRivera.tone).toBe<ToneStyle>("enthusiastic");
  });

  it("targets all audience levels", () => {
    expect(kaiRivera.audienceLevel).toBe("all-levels");
  });
});

describe("Frank Okafor – Personal Finance specialist", () => {
  it("is in the personal-finance domain", () => {
    expect(frankOkafor.domain).toBe<ContentDomain>("personal-finance");
  });

  it("has an analytical tone", () => {
    expect(frankOkafor.tone).toBe<ToneStyle>("analytical");
  });

  it("excludes fiduciary advice from expertise", () => {
    const hasExclusion = frankOkafor.expertiseBoundaries.some((b) =>
      b.toLowerCase().includes("fiduciary")
    );
    expect(hasExclusion).toBe(true);
  });
});

describe("Dana Torres – Home DIY specialist", () => {
  it("is in the home-diy domain", () => {
    expect(danaTorres.domain).toBe<ContentDomain>("home-diy");
  });

  it("has a practical tone", () => {
    expect(danaTorres.tone).toBe<ToneStyle>("practical");
  });
});

describe("Marcus Webb – Health & Fitness specialist", () => {
  it("is in the health-fitness domain", () => {
    expect(marcusWebb.domain).toBe<ContentDomain>("health-fitness");
  });

  it("has a motivational tone", () => {
    expect(marcusWebb.tone).toBe<ToneStyle>("motivational");
  });
});

describe("Grace Nakamura – Gardening specialist", () => {
  it("is in the gardening domain", () => {
    expect(graceNakamura.domain).toBe<ContentDomain>("gardening");
  });

  it("has a nurturing tone", () => {
    expect(graceNakamura.tone).toBe<ToneStyle>("nurturing");
  });

  it("targets all audience levels", () => {
    expect(graceNakamura.audienceLevel).toBe("all-levels");
  });
});
