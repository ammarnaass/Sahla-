import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoldenEvalHarness } from "@/server/education/guidance/goldenEval";

export async function POST() {
  try {
    const summary = GoldenEvalHarness.runSuite();
    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "eval_run_failed", message: err?.message } },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const runs = db.prepare(`
      SELECT id, pack_version, prompt_version, total_cases, passed_cases, score_avg, cost_ratio, created_at
      FROM golden_eval_runs
      ORDER BY created_at DESC LIMIT 10
    `).all();

    return NextResponse.json({ runs });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "eval_history_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
