/**
 * 🧠 AI Admin Engine — Types (أنواع محرك الذكاء الاصطناعي)
 * Strict TypeScript contracts for AI chat, insights, forecasts, and tool execution.
 */

// ─── Chat Types ───

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    tools_used?: string[];
    data_refs?: string[];
    confidence?: number;
    pending_action?: PendingAction;
  };
}

export interface PendingAction {
  tool: AdminAITool;
  params: Record<string, any>;
  description_ar: string;
  requires_confirmation: boolean;
}

export interface AIConversation {
  id: string;
  admin_user_id: string;
  messages: AIMessage[];
  context_snapshot?: AdminContextSnapshot;
  created_at: string;
  updated_at: string;
}

// ─── Context Types ───

export interface AdminContextSnapshot {
  totalShops: number;
  activeShops: number;
  inactiveShops: number;
  totalPoints: number;
  totalDocs: number;
  mrrDZD: number;
  arrDZD: number;
  activeSubscriptions: number;
  invoicesCount: number;
  paidInvoicesDZD: number;
  pendingInvoicesDZD: number;
  topWilayas: { name: string; code: number; count: number; active: number }[];
  planBreakdown: { planId: string; planNameAr: string; count: number; revenueDZD: number }[];
  activityBreakdown: Record<string, number>;
  recentAlerts: string[];
  snapshot_at: string;
}

// ─── Insights Types ───

export type InsightType = "growth" | "risk" | "opportunity" | "anomaly";
export type InsightSeverity = "info" | "warning" | "critical";

export interface AIInsight {
  id: string;
  type: InsightType;
  title_ar: string;
  body_ar: string;
  severity: InsightSeverity;
  icon: string;
  data_points: Record<string, number | string>;
  action_suggestion_ar?: string;
  created_at: string;
}

// ─── Forecast Types ───

export type TrendDirection = "up" | "down" | "stable";

export interface AIForecast {
  id: string;
  metric_ar: string;
  metric_key: string;
  current_value: number;
  predicted_value: number;
  confidence: number;
  trend: TrendDirection;
  period_ar: string;
  explanation_ar: string;
}

// ─── Tool Types ───

export type AdminAITool =
  | "get_national_overview"
  | "get_shop_details"
  | "get_wilaya_stats"
  | "topup_shop"
  | "toggle_shop_status"
  | "get_revenue_trends"
  | "get_document_stats"
  | "search_shops";

export interface ToolDefinition {
  name: AdminAITool;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
    enum?: string[];
  }>;
  is_write_operation: boolean;
}

export interface ToolExecutionResult {
  tool: AdminAITool;
  success: boolean;
  data: any;
  summary_ar: string;
}

// ─── API Request/Response Types ───

export interface AIChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  conversation_id?: string;
}

export interface AIChatResponse {
  success: boolean;
  message: AIMessage;
  conversation_id: string;
}

export interface AIInsightsResponse {
  success: boolean;
  insights: AIInsight[];
  generated_at: string;
  cached: boolean;
}

export interface AIForecastResponse {
  success: boolean;
  forecasts: AIForecast[];
  generated_at: string;
}

export interface AIActionRequest {
  action: AdminAITool;
  params: Record<string, any>;
  confirmed: boolean;
}

export interface AIActionResponse {
  success: boolean;
  result: {
    action: AdminAITool;
    executed: boolean;
    summary_ar: string;
    data?: any;
  };
}
