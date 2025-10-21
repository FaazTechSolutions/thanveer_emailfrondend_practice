"use client";
import { useState, useEffect } from "react";
import { EmailContent } from "../components/email/EmailContent";
import { AnalysisSection } from "../components/email/AnalysisSection";
import { EmailList } from "../components/email/Emaillist1";
import { EmailDetail } from "../components/email/EmailDetail";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ProcessIcon 
} from "../components/ui/Icons";
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

export interface ProcessResult {
  success: boolean;
  data: Array<ProcessResultItem>;
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
export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [existingProcessResults, setExistingProcessResults] = useState<ProcessResult | null>(null);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("CreatedDateTime");
  const [orderDir, setOrderDir] = useState<0 | 1>(0);
  const size = 5;

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://thanveer-emailbackend-practice.onrender.com/emails?page=${page}&size=${size}&orderby=${orderBy}&orderdir=${orderDir}`
      );
      const data = await res.json();
      setEmails(data.data.Data || []);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingProcessResults = async (reqId: string) => {
    try {
      const response = await fetch(`https://thanveer-emailbackend-practice.onrender.com/email-by-reqid?req_id=${reqId}`);
      if (response.ok) {
        const result = await response.json();
        setExistingProcessResults(result);
      }
    } catch (error) {
      console.error('Failed to fetch existing process results:', error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page, orderBy, orderDir]);

  useEffect(() => {
    if (selectedEmail) {
      fetchExistingProcessResults(selectedEmail.RecId);
    }
  }, [selectedEmail]);

  const handleProcessEmail = async (email: Email) => {
    setProcessing(true);
    setProcessResult(null);
    
    try {
      const response = await fetch(`https://thanveer-emailbackend-practice.onrender.com/ingest-email?reqid=${email.RecId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      await fetchExistingProcessResults(email.RecId);
      
    } catch (error) {
      console.error('Failed to process email:', error);
      setProcessResult({ 
        success: false,
        data: []
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSort = (column: string) => {
    if (orderBy === column) {
      setOrderDir(orderDir === 0 ? 1 : 0);
    } else {
      setOrderBy(column);
      setOrderDir(0);
    }
  };

  const handleOpenEmail = (email: Email) => {
    setSelectedEmail(email);
    setProcessResult(null);
  };

  const handleCloseEmail = () => {
    setSelectedEmail(null);
    setProcessResult(null);
    setExistingProcessResults(null);
  };

  if (selectedEmail) {
    return (
      <EmailDetail
        email={selectedEmail}
        processing={processing}
        existingProcessResults={existingProcessResults}
        onProcessEmail={handleProcessEmail}
        onClose={handleCloseEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Inbox</h1>
          <p className="text-gray-600 mt-2">Manage and process your emails with AI analysis</p>
        </div>

        <EmailList
          emails={emails}
          loading={loading}
          orderBy={orderBy}
          orderDir={orderDir}
          page={page}
          onSort={handleSort}
          onOpenEmail={handleOpenEmail}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
