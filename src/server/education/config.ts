/**
 * ⚙️ Sahla Education Engine Configuration (Technical Spec v1.0)
 * Configurable model parameters, pricing rules, and runtime defaults.
 */

export const EDUCATION_CONFIG = {
  models: {
    planner: process.env.ANTHROPIC_MODEL_PLANNER || "claude-sonnet-5-5",
    writer: process.env.ANTHROPIC_MODEL_WRITER || "claude-sonnet-5-5",
    solver: process.env.ANTHROPIC_MODEL_SOLVER || "claude-sonnet-5-5",
    reviewer: process.env.ANTHROPIC_MODEL_REVIEWER || "claude-haiku-4-5-20251001",
    intake: process.env.ANTHROPIC_MODEL_INTAKE || "claude-haiku-4-5-20251001",
    references: process.env.ANTHROPIC_MODEL_REFS || "claude-haiku-4-5-20251001",
  },
  pricing: {
    planCreation: 0, // الخطة أولاً مجانية لتفادي الهدر
    pointsByPageCount: {
      1: 8,
      2: 10,
      3: 15,
      5: 20,
      10: 30,
    } as Record<number, number>,
    examSolutionUnlock: 2,
    freeSectionRegenerateLimit: 3,
    extraSectionRegenerateCost: 2,
  },
  concurrency: {
    maxConcurrentJobsPerShop: 5,
    rateLimitPerMinute: 30,
  },
  privacy: {
    studentDataRetentionHours: 72, // امتثالاً للقانون الجزائري 18-07
  },
};

export function calculateJobPoints(pages: number, options?: { math_latex?: boolean }): number {
  let cost = 15;
  if (pages <= 2) cost = 10;
  else if (pages === 3) cost = 15;
  else if (pages === 5) cost = 20;
  else if (pages >= 10) cost = 30;

  if (options?.math_latex) {
    cost += 2;
  }
  return cost;
}
