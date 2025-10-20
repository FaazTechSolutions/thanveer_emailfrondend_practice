// components/email/AnalysisSection.tsx
'use client'

import { useState } from 'react';

import { StatusBadge } from '../ui/StatusBadge';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { StructuredDataGrid } from './StructuredDataGrid';
import { Card, CardHeader, CardContent } from '../ui/Card'
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
};

interface AnalysisSectionProps {
  email: any;
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

const AccordionSection = ({ title, isOpen, onToggle, children, badge }: AccordionSectionProps) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full p-6 text-left  transition-colors"
      >
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-gray-900 text-lg">{title}</h4>
          {badge && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

export const AnalysisSection = ({ email }: AnalysisSectionProps) => {
  const { analysis_result } = email;
  
  const [openSections, setOpenSections] = useState({
    summary: false,
    classification: false,
    action: false,
    structuredData: false,
    actionItems: analysis_result.action_items.length > 0,
    confidence: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
        <p className="text-sm text-gray-600 mt-1">Processed in {email.processing_time_ms}ms</p>
      </CardHeader>

      <div className="divide-y divide-gray-200">
        {/* Summary Accordion */}
        <AccordionSection
          title="Summary"
          isOpen={openSections.summary}
          onToggle={() => toggleSection('summary')}
        >
          <p className="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {analysis_result.summary}
          </p>
        </AccordionSection>

        {/* Classification Accordion */}
        <AccordionSection
          title="Classification"
          isOpen={openSections.classification}
          onToggle={() => toggleSection('classification')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Category</label>
              <StatusBadge type="category" value={analysis_result.classification.category} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Priority</label>
              <StatusBadge type="priority" value={analysis_result.classification.priority} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Sentiment</label>
              <StatusBadge type="sentiment" value={analysis_result.classification.sentiment} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Confidence</label>
              <ConfidenceBar confidence={analysis_result.classification.confidence} />
            </div>
          </div>
        </AccordionSection>

        {/* Next Best Action Accordion */}
        <AccordionSection
          title="Recommended Action"
          isOpen={openSections.action}
          onToggle={() => toggleSection('action')}
          badge="Important"
        >
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-blue-900 font-medium text-lg">{analysis_result.next_best_action}</p>
                  <p className="text-blue-700 text-sm mt-1">{analysis_result.action_reasoning}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ConfidenceBar confidence={analysis_result.action_confidence} showLabel={false} />
                <span className="text-blue-800 font-medium">
                  {Math.round(analysis_result.action_confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Structured Data Accordion */}
        <AccordionSection
          title="Extracted Information"
          isOpen={openSections.structuredData}
          onToggle={() => toggleSection('structuredData')}
          badge={Object.keys(analysis_result.structured_data).filter(key => key !== 'confidence').length + " items"}
        >
          <StructuredDataGrid structuredData={analysis_result.structured_data} />
        </AccordionSection>

        {/* Action Items Accordion */}
        {analysis_result.action_items.length > 0 && (
          <AccordionSection
            title="Action Items"
            isOpen={openSections.actionItems}
            onToggle={() => toggleSection('actionItems')}
            badge={analysis_result.action_items.length + " actions"}
          >
            <div className="space-y-3">
              {analysis_result.action_items.map((item: any, index: any) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900 font-medium">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ConfidenceBar confidence={item.confidence} showLabel={false} />
                    <span className="text-sm text-gray-600 font-medium w-12">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Confidence Scores Accordion */}
        <AccordionSection
          title="Confidence Scores"
          isOpen={openSections.confidence}
          onToggle={() => toggleSection('confidence')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analysis_result.confidence_scores).map(([key, value]: [any, any]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(value * 100)}%
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      </div>
    </Card>
  );
};