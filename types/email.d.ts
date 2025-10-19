// types/email.ts
export interface Email {
  id: number;
  req_id: string;
  pretext: string;
  core: string;
  posttext: string;
  clean_text: string;
  translated: boolean;
  original_email: {
    subject: string;
    body: string;
  };
  translated_content: {
    subject: string;
    body: string;
  } | null;
  created_at: string;
  analysis_result: {
    summary: string;
    action_items: Array<{
      action: string;
      confidence: number;
    }>;
    classification: {
      category: string;
      priority: string;
      sentiment: string;
      confidence: number;
    };
    structured_data: {
      [key: string]: {
        value: string | null;
        confidence: number;
      };
      confidence: {
        value: string | null;
        confidence: number;
      };
    };
    action_reasoning: string;
    next_best_action: string;
    action_confidence: number;
    confidence_scores: {
      overall: number;
      action_items: number;
      classification: number;
      structured_data: number;
    };
    processing_time_ms: number;
    requires_human_review: boolean;
  };
  summary: string;
  requires_human_review: boolean;
  review_reason: string | null;
  processing_time_ms: number;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: Email[];
}