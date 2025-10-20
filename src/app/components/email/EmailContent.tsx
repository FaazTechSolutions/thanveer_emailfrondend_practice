// components/email/EmailContent.tsx
'use client'

import { useState } from 'react';
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
import { Card, CardHeader, CardContent } from '../ui/Card';

interface EmailContentProps {
  email: any;
}

export const EmailContent = ({ email }: EmailContentProps) => {
  const [activeTab, setActiveTab] = useState<'original' | 'translated'>(
    email.translated ? 'translated' : 'original'
  );

  const hasTranslation =  email.translated_content;
  console.log('Email in EmailContent:', email)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'translated' && hasTranslation 
                ? email.translated_content?.subject || email.original_email.subject
                : email.original_email.subject
              }
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge type="priority" value={`${email.analysis_result.classification.priority} Priority`} />
              <StatusBadge type="category" value={email.analysis_result.classification.category} />
              <span className="text-sm text-gray-500">
                Received: {new Date(email.created_at).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                ID: #{email.req_id}
              </span>
              {hasTranslation && (
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                  Translated
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Tab Navigation */}
      {hasTranslation && (
        <div className="border-b border-gray-200">
          <div className="px-6 flex space-x-8">
            <button
              onClick={() => setActiveTab('original')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'original'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Original Content
            </button>
            <button
              onClick={() => setActiveTab('translated')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'translated'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Translated Content
            </button>
          </div>
        </div>
      )}

      <CardContent>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              {hasTranslation 
                ? activeTab === 'translated' ? 'Translated Content' : 'Original Content'
                : 'Original Content'
              }
            </span>
            {hasTranslation && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === 'translated' 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {activeTab === 'translated' ? 'Translated' : 'Original'}
              </span>
            )}
          </div>
          
          <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-6">
            {activeTab === 'translated' && hasTranslation
              ? email.translated_content?.body || email.original_email.body
              : email.original_email.body
            }
          </pre>

          {/* Translation Status Indicator */}
          {!email.translated_content && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-yellow-700">
                  This email has not been translated
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};