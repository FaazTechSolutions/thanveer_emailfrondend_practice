// app/page.tsx
'use client'

import { useState, useEffect } from 'react';
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
import { Header } from './components/layout/Header';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { EmailList } from './components/email/EmailList';
import { EmailContent } from './components/email/EmailContent';
import { AnalysisSection } from './components/email/AnalysisSection';
import { Card, CardHeader } from './components/ui/Card';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

export default function EmailIntelligenceDashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const res = await fetch('http://localhost:3000/mails?limit=10&offset=0');
      
      if (!res.ok) throw new Error('Failed to fetch emails');
      
      const data: ApiResponse = await res.json();
      setEmails(data.data);
      
      if (!selectedEmail && data.data.length > 0) {
        setSelectedEmail(data.data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleRefresh = () => {
    fetchEmails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading email intelligence data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchEmails()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        emailCount={emails.length} 
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <DashboardLayout
        sidebar={
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Email Inbox</h2>
                <span className="text-sm text-gray-500">AI Analyzed</span>
              </div>
            </CardHeader>
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              onEmailSelect={setSelectedEmail}
              loading={refreshing}
            />
          </Card>
        }
        mainContent={
          selectedEmail ? (
            <div className="space-y-6">
              <EmailContent email={selectedEmail} />
              <AnalysisSection email={selectedEmail} />
            </div>
          ) : (
            <Card>
              <div className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Selected</h3>
                <p className="text-gray-600">Select an email from the list to view its AI analysis and insights</p>
              </div>
            </Card>
          )
        }
      />
    </div>
  );
}