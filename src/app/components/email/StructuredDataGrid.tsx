// components/email/StructuredDataGrid.tsx
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
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { Card, CardContent } from '../ui/Card';

interface StructuredDataGridProps {
  structuredData: Email['analysis_result']['structured_data'];
}

export const StructuredDataGrid = ({ structuredData }: StructuredDataGridProps) => {
  const dataEntries = Object.entries(structuredData).filter(([key]) => key !== 'confidence');

  if (dataEntries.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-500 text-center">No structured data extracted</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dataEntries.map(([key, value]) => (
        <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-gray-700 capitalize text-sm">
              {key.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16">
                <ConfidenceBar confidence={value.confidence} showLabel={false} size="sm" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {Math.round(value.confidence * 100)}%
              </span>
            </div>
          </div>
          <p className="text-gray-900 text-sm mt-1">{value.value || 'Not specified'}</p>
        </div>
      ))}
    </div>
  );
};