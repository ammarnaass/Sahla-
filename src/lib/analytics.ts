// Sahla Analytics Engine (محرك الأحداث التحليلية — PRD Section 9)
// Events tracked once per operation as specified in PRD

export type SahlaEvent =
  | "landing_view"
  | "signup_start"
  | "otp_sent"
  | "otp_verified"
  | "shop_created"
  | "onboarding_step_1"
  | "onboarding_step_2"
  | "onboarding_step_3"
  | "onboarding_skipped"
  | "first_doc_created"
  | "first_topup"
  | "service_used"
  | "pwa_installed";

interface AnalyticsEntry {
  event: SahlaEvent;
  timestamp: string;
  url: string;
  data: Record<string, unknown>;
}

const STORAGE_KEY = "sahla_analytics_events";
const MAX_EVENTS = 200;

// Deduplicate: track only once per session for one-time events
const trackedThisSession = new Set<string>();

export function track(event: SahlaEvent, data: Record<string, unknown> = {}) {
  // One-time events should fire only once per operation (PRD §9)
  const oneTimeEvents: SahlaEvent[] = [
    "signup_start",
    "shop_created",
    "first_doc_created",
    "first_topup",
    "pwa_installed",
  ];

  if (oneTimeEvents.includes(event)) {
    if (trackedThisSession.has(event)) return;
    trackedThisSession.add(event);
  }

  const entry: AnalyticsEntry = {
    event,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.pathname : "/",
    data,
  };

  // Persist to localStorage
  try {
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as AnalyticsEntry[];
    existing.push(entry);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing.slice(-MAX_EVENTS))
    );
  } catch {
    // Silent fail on storage errors
  }

  // Log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Sahla Analytics] 📊 ${event}`, data);
  }
}
