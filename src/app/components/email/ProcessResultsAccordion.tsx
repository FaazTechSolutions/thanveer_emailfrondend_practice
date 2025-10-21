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
import { EmailContent } from "./EmailContent";
import { AnalysisSection } from "./AnalysisSection";
import { AnalysisIcon, ChevronDownIcon } from "../ui/Icons";

interface ProcessResultsAccordionProps {
  processResults: ProcessResultItem[];
  expandedProcess: number | null;
  activeContentTabs: { [key: number]: "original" | "translated" };
  onToggleProcess: (index: number) => void;
  onContentTabChange: (index: number, tab: "original" | "translated") => void;
  processing: boolean;
}

export function ProcessResultsAccordion({
  processResults,
  expandedProcess,
  activeContentTabs,
  onToggleProcess,
  onContentTabChange,
  processing
}: ProcessResultsAccordionProps) {

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`;
  };

  if (processResults.length=== 0 && !processing) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <AnalysisIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
        <p className="text-gray-500 mb-6">
          Process this email to see AI-powered analysis and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
         {processResults.length > 0 && (<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <AnalysisIcon className="w-5 h-5 text-blue-600" />
        Processing Results 
     
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {processResults.length}
          </span>
       
      </h2>)}
      <div className="space-y-4">
        {processResults.map((item, index) => (
          <div key={`${item.id}-${item.process_label}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onToggleProcess(index)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  item.analysis_result.requires_human_review ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <span className="font-semibold text-gray-900 text-lg">
                    {item.process_label} 
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  item.analysis_result.requires_human_review 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {item.analysis_result.requires_human_review ? 'Needs Review' : 'Auto-processed'}
                </span>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200">
                  {formatConfidence(item.analysis_result.confidence_scores.overall)} confidence
                </span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                    expandedProcess === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {expandedProcess === index && (
              <div className="border-t border-gray-200">
                <div className="p-6 space-y-6">
                  <EmailContent 
                    email={item} 
               
                  />
                  <AnalysisSection email={item} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}