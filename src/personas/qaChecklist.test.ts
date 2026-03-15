/**
 * Tests for the persona QA checklist and evaluation engine (Issue #4).
 */

import {
  personaQAChecklist,
  getChecksByCategory,
  getBlockingChecks,
  evaluatePersonaQA,
} from "../personas/qaChecklist";
import {
  QACheckCategory,
  QACheckResult,
} from "../types/persona";

// ─── Checklist integrity ──────────────────────────────────────────────────────

describe("Persona QA checklist", () => {
  it("contains at least 10 checks", () => {
    expect(personaQAChecklist.length).toBeGreaterThanOrEqual(10);
  });

  it("has no duplicate checkIds", () => {
    const ids = personaQAChecklist.map((c) => c.checkId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one blocking check", () => {
    const blocking = personaQAChecklist.filter((c) => c.isBlocking);
    expect(blocking.length).toBeGreaterThan(0);
  });

  it("covers all defined QA categories", () => {
    const expectedCategories: QACheckCategory[] = [
      "tone-consistency",
      "vocabulary",
      "expertise-boundary",
      "visual-identity",
      "delivery-style",
      "audience-alignment",
    ];
    const presentCategories = new Set(personaQAChecklist.map((c) => c.category));
    for (const cat of expectedCategories) {
      expect(presentCategories).toContain(cat);
    }
  });

  it("every check has non-empty description and passCriteria", () => {
    for (const check of personaQAChecklist) {
      expect(check.description.trim()).not.toBe("");
      expect(check.passCriteria.trim()).not.toBe("");
    }
  });
});

// ─── getChecksByCategory ──────────────────────────────────────────────────────

describe("getChecksByCategory", () => {
  it("returns only checks of the requested category", () => {
    const checks = getChecksByCategory("tone-consistency");
    expect(checks.length).toBeGreaterThan(0);
    for (const check of checks) {
      expect(check.category).toBe("tone-consistency");
    }
  });

  it("returns multiple checks for expertise-boundary", () => {
    const checks = getChecksByCategory("expertise-boundary");
    expect(checks.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── getBlockingChecks ────────────────────────────────────────────────────────

describe("getBlockingChecks", () => {
  it("returns only blocking checks", () => {
    const checks = getBlockingChecks();
    for (const check of checks) {
      expect(check.isBlocking).toBe(true);
    }
  });

  it("returns all blocking checks from the checklist", () => {
    const allBlocking = personaQAChecklist.filter((c) => c.isBlocking);
    expect(getBlockingChecks()).toHaveLength(allBlocking.length);
  });
});

// ─── evaluatePersonaQA ────────────────────────────────────────────────────────

describe("evaluatePersonaQA", () => {
  const allPassResults: QACheckResult[] = personaQAChecklist.map((c) => ({
    checkId: c.checkId,
    passed: true,
  }));

  it("returns a passed report when all checks pass", () => {
    const report = evaluatePersonaQA("tara-chen", "Python install guide", allPassResults);
    expect(report.passed).toBe(true);
    expect(report.failureSummary).toHaveLength(0);
  });

  it("sets characterId and contentTitle correctly", () => {
    const report = evaluatePersonaQA(
      "kai-rivera",
      "Quick pasta recipe",
      allPassResults
    );
    expect(report.characterId).toBe("kai-rivera");
    expect(report.contentTitle).toBe("Quick pasta recipe");
  });

  it("sets checkedAt to a recent Date", () => {
    const before = new Date();
    const report = evaluatePersonaQA("frank-okafor", "Budget 101", allPassResults);
    const after = new Date();
    expect(report.checkedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(report.checkedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("fails the report when a blocking check fails", () => {
    const results: QACheckResult[] = personaQAChecklist.map((c) => ({
      checkId: c.checkId,
      passed: c.checkId === "boundary-001" ? false : true,
      notes: c.checkId === "boundary-001" ? "Script mentions stock picking" : undefined,
    }));
    const report = evaluatePersonaQA("frank-okafor", "Investing 101", results);
    expect(report.passed).toBe(false);
    expect(report.failureSummary.some((s) => s.includes("boundary-001"))).toBe(true);
    expect(report.failureSummary.some((s) => s.startsWith("[BLOCKING]"))).toBe(true);
  });

  it("does not fail the overall report for a non-blocking warning", () => {
    const results: QACheckResult[] = personaQAChecklist.map((c) => ({
      checkId: c.checkId,
      passed: c.checkId === "vocab-002" ? false : true,
    }));
    const report = evaluatePersonaQA("marcus-webb", "Morning workout", results);
    expect(report.passed).toBe(true);
    expect(report.failureSummary.some((s) => s.startsWith("[WARNING]"))).toBe(true);
  });

  it("includes notes in the failure summary when provided", () => {
    const results: QACheckResult[] = personaQAChecklist.map((c) => ({
      checkId: c.checkId,
      passed: c.checkId === "tone-001" ? false : true,
      notes: c.checkId === "tone-001" ? "Script sounds too casual" : undefined,
    }));
    const report = evaluatePersonaQA("tara-chen", "Router setup guide", results);
    expect(report.failureSummary.some((s) => s.includes("Script sounds too casual"))).toBe(true);
  });

  it("handles partial results (not all checks submitted)", () => {
    const partial: QACheckResult[] = [
      { checkId: "tone-001", passed: true },
      { checkId: "boundary-001", passed: true },
    ];
    const report = evaluatePersonaQA("grace-nakamura", "Compost guide", partial);
    expect(report.passed).toBe(true);
    expect(report.results).toHaveLength(2);
  });

  it("throws for an unknown characterId", () => {
    expect(() =>
      evaluatePersonaQA("unknown-id", "Test", allPassResults)
    ).toThrow(/unknown characterid/i);
  });

  it("throws for an unknown checkId in results", () => {
    const badResults: QACheckResult[] = [
      ...allPassResults,
      { checkId: "nonexistent-check", passed: true },
    ];
    expect(() =>
      evaluatePersonaQA("dana-torres", "Shelf assembly", badResults)
    ).toThrow(/unknown checkid/i);
  });
});
