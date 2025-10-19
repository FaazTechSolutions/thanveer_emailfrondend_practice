// components/email/EmailList.tsx
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
import { StatusBadge } from '../ui/StatusBadge';
import { ConfidenceBar } from '../ui/ConfidenceBar';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  loading?: boolean;
}

export const EmailList = ({ emails, selectedEmail, onEmailSelect, loading = false }: EmailListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
      {emails.map((email, index) => (
        <div
          key={email.id}
          className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
            selectedEmail?.id === email.id 
              ? 'bg-blue-50 border-blue-200 shadow-sm' 
              : 'hover:bg-gray-50'
          } ${index === 0 ? 'border-t-0' : ''}`}
          onClick={() => onEmailSelect(email)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
              {email.original_email.subject}
            </h3>
            <StatusBadge type="priority" value={email.analysis_result.classification.priority} />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge type="category" value={email.analysis_result.classification.category} />
            <StatusBadge type="sentiment" value={email.analysis_result.classification.sentiment} />
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {email.analysis_result.summary}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1">
              <ConfidenceBar confidence={email.analysis_result.confidence_scores.overall} showLabel={false} size="sm" />
              <span className="text-xs text-gray-500">
                {Math.round(email.analysis_result.confidence_scores.overall * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(email.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                #{email.req_id}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};