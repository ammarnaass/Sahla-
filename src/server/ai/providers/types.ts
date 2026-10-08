export type AIProviderId = string;

export type AIProviderKind = "anthropic" | "huggingface" | "openai_compatible" | "gemini";

export type AIProviderStatus = "unknown" | "ok" | "error";

export interface Capabilities {
  tool_use: boolean;
  json_mode: boolean;
  structured_output: "tool" | "json_object" | "none";
  streaming: boolean;
  max_context: number;
  vision: boolean;
  languages_verified: string[];
  web_search: boolean;
  prompt_caching: boolean;
}

export interface PingChecks {
  auth: "ok" | "error";
  model_available: "ok" | "error";
  json_output: "ok" | "error";
  arabic_sample: "ok" | "error";
  tool_use?: "ok" | "skipped" | "error";
}

export interface PingResult {
  status: AIProviderStatus;
  latency_ms: number;
  model: string;
  checks: PingChecks;
  capabilities: Partial<Capabilities>;
  message_ar: string;
  error?: string;
}

export interface AIModelDefinition {
  id: string;
  name: string;
  contextWindow?: string;
  description_ar: string;
  badge?: string;
}

export interface AdvancedProviderConfig {
  thinking_budget?: number; // e.g. 0 to 8192 tokens for Gemini reasoning or models with budget
  enable_search_grounding?: boolean; // Google search grounding toggle
  safety_level?: "BLOCK_NONE" | "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH";
  timeout_seconds?: number; // Request timeout in seconds
  temperature?: number;
  max_tokens?: number;
  allow_local?: boolean; // If true, local/on-premise endpoints are allowed
}

export interface AIProviderRecord {
  id: string;
  kind: AIProviderKind;
  name: string;
  base_url?: string;
  model: string;
  key_encrypted?: string;
  key_last4?: string;
  key_masked?: string;
  capabilities: Capabilities;
  status: AIProviderStatus;
  last_ping_at?: string | null;
  last_ping_ms?: number | null;
  last_error?: string | null;
  is_primary: boolean;
  fallback_order?: number | null;
  enabled: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
  available_models?: AIModelDefinition[];
  // Advanced Customization Fields
  preset_id?: string;
  custom_headers?: Record<string, string>;
  advanced_config?: AdvancedProviderConfig;
  custom_models?: AIModelDefinition[];
}

// Backward compatibility alias for UI & legacy callers
export type ProviderConfig = AIProviderRecord;

export interface ProviderHealthCheck {
  success: boolean;
  providerId: string;
  modelId: string;
  latency_ms?: number;
  latencyMs?: number;
  message_ar: string;
  error?: string;
}

export interface ProviderGenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  responseMimeType?: string;
  responseSchema?: any;
}

export interface ProviderGenerateResult {
  text: string;
  providerId: string;
  modelId: string;
  durationMs: number;
  functionCalls?: Array<{ name: string; args: Record<string, any> }>;
  tokensUsed?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

export interface IAIProviderAdapter {
  id: string;
  testConnection(apiKey: string, modelId: string): Promise<ProviderHealthCheck>;
  generate?(messages: any[], options: ProviderGenerateOptions, apiKey: string, modelId: string): Promise<ProviderGenerateResult>;
}

export interface GenerateRequest {
  system: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  schema?: any;
  maxTokens: number;
  temperature?: number;
  timeoutMs?: number;
  metadata?: { skill: string; jobId?: string };
}

export interface GenerateResult {
  text?: string;
  json?: unknown;
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
  providerId: string;
  modelId: string;
}

export interface LLMProvider {
  id: string;
  kind: AIProviderKind;
  capabilities: Capabilities;
  generate(
    req: GenerateRequest,
    apiKey: string,
    modelId: string,
    baseUrl?: string,
    options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<GenerateResult>;
  ping(
    apiKey: string,
    modelId: string,
    baseUrl?: string,
    options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<PingResult>;
}

export interface AIRoutingRule {
  skill: string;
  provider_id: string;
  min_capabilities?: Partial<Capabilities>;
  updated_at?: string;
}

export interface AIAuditLog {
  id: string;
  actor_id?: string;
  action: string;
  provider_id?: string;
  before_json?: any;
  after_json?: any;
  ip?: string;
  at: string;
}

export interface AIUsageRecord {
  id: string;
  provider_id: string;
  skill?: string;
  job_id?: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  status: "ok" | "error";
  cost_estimate?: number;
  at: string;
}
