import { useState } from "react";
export interface Email {
  RecId: string;
  Subject: string;
  Body: string;
  CreatedDateTime: string;
  From: string;
  To: string;
  ToRecipients: string;
  Comments?: string;
  [key: string]: any;
}
export interface ProcessResultItem {
  id: number;
  req_id: string;
  process_label: string;
  pretext: string;
  core: string;
  posttext: string;
  clean_text: string;
  original_email: {
    body: string;
    subject: string;
  };
  translated_content?: {
    subject: string;
    body: string;
  };
  analysis_result: {
    summary: string;
    tokenUsage: {
      inputTokens: number;
      totalTokens: number;
      outputTokens: number;
    };
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
    structured_data: any;
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
  created_at: string;
}

export interface ProcessResult {
  success: boolean;
  data: Array<ProcessResultItem>;
}
import { ProcessResultsAccordion } from "./ProcessResultsAccordion";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ArrowLeftIcon, ProcessIcon } from "../ui/Icons";
import { EmailHeader } from "./EmailHeader";

interface EmailDetailProps {
  email: Email;
  processing: boolean;
  existingProcessResults: ProcessResult | null;
  onProcessEmail: (email: Email) => void;
  onClose: () => void;
}

export function EmailDetail({ 
  email, 
  processing, 
  existingProcessResults, 
  onProcessEmail, 
  onClose 
}: EmailDetailProps) {
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);
  const [activeContentTabs, setActiveContentTabs] = useState<{ [key: number]: "original" | "translated" }>({});

  const toggleProcess = (index: number) => {
    setExpandedProcess(expandedProcess === index ? null : index);
    if (expandedProcess !== index) {
      setActiveContentTabs(prev => ({
        ...prev,
        [index]: "original"
      }));
    }
  };

  const handleContentTabChange = (index: number, tab: "original" | "translated") => {
    setActiveContentTabs(prev => ({
      ...prev,
      [index]: tab
    }));
  };

  const allProcessResults = [
    ...(existingProcessResults?.success ? existingProcessResults.data : [])
  ];

  const uniqueProcessResults = allProcessResults.filter((result, index, self) =>
    index === self.findIndex(t => 
      t.process_label === result.process_label && 
      t.created_at === result.created_at
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onClose}
          className="mb-6 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Inbox
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <EmailHeader 
            email={email} 
            onProcessEmail={() => onProcessEmail(email)}
            processing={processing}
          />

          <ProcessResultsAccordion
            processResults={uniqueProcessResults}
            expandedProcess={expandedProcess}
            activeContentTabs={activeContentTabs}
            onToggleProcess={toggleProcess}
            onContentTabChange={handleContentTabChange}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
}