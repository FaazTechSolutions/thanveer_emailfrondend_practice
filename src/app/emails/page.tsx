"use client";

import { useState, useEffect } from "react";
import { EmailContent } from "../components/email/EmailContent";
import { AnalysisSection } from "../components/email/AnalysisSection";

interface Email {
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

interface ProcessResult {
  success: boolean;
  data: Array<{
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
  }>;
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
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);
  const [activeContentTabs, setActiveContentTabs] = useState<{ [key: number]: "original" | "translated" }>({});
  const size = 5;

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/emails?page=${page}&size=${size}&orderby=${orderBy}&orderdir=${orderDir}`
      );
      const data = await res.json();
      setEmails(data.data.Data || []);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing processed results for the selected email
  const fetchExistingProcessResults = async (reqId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/email-by-reqid?req_id=${reqId}`);
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

  // When an email is selected, fetch its existing process results
  useEffect(() => {
    if (selectedEmail) {
      fetchExistingProcessResults(selectedEmail.RecId);
    }
  }, [selectedEmail]);

  const handleProcessEmail = async (email: Email) => {
    setProcessing(true);
    setProcessResult(null);
    
    try {
      const response = await fetch(`http://localhost:3000/ingest-email?reqid=${email.RecId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // After successful processing, refetch the existing results
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
    setExpandedProcess(null);
    setActiveContentTabs({});
  };

  const handleCloseEmail = () => {
    setSelectedEmail(null);
    setProcessResult(null);
    setExistingProcessResults(null);
  };

  const toggleProcess = (index: number) => {
    setExpandedProcess(expandedProcess === index ? null : index);
    // Set default tab to original when expanding
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

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`;
  };

  // Get all process results (new + existing)
  const allProcessResults = [
    ...(existingProcessResults?.success ? existingProcessResults.data : [])
  ];

  // Remove duplicates based on process_label and created_at
  const uniqueProcessResults = allProcessResults.filter((result, index, self) =>
    index === self.findIndex(t => 
      t.process_label === result.process_label && 
      t.created_at === result.created_at
    )
  );

  // If an email is selected, show the email detail view
  if (selectedEmail) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleCloseEmail}
            className="mb-6 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Inbox
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedEmail.Subject}
                </h1>
                <button
                  onClick={() => handleProcessEmail(selectedEmail)}
                  disabled={processing}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {processing ? (
                    <>
                      <LoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ProcessIcon className="w-4 h-4" />
                      Process Email
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <strong className="text-gray-700">ReqID:</strong> 
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{selectedEmail.RecId}</code>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <strong className="text-gray-700">Date:</strong>
                  <span>{new Date(selectedEmail.CreatedDateTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <strong className="text-gray-700">From:</strong> 
                  <span className="truncate">{selectedEmail.From}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <strong className="text-gray-700">To:</strong> 
                  <span className="truncate">
                    {selectedEmail.ToRecipients.split(',').slice(0, 2).join(', ')}
                    {selectedEmail.ToRecipients.split(',').length > 2 && (
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800 text-xs underline"
                        onClick={() => {
                          alert(`All recipients: ${selectedEmail.ToRecipients}`);
                        }}
                      >
                        +{selectedEmail.ToRecipients.split(',').length - 2} more
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Process Results Accordion */}
            {(uniqueProcessResults.length > 0 || processResult?.success) && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AnalysisIcon className="w-5 h-5 text-blue-600" />
                  Processing Results 
                  {uniqueProcessResults.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {uniqueProcessResults.length}
                    </span>
                  )}
                </h2>
                <div className="space-y-4">
                  {uniqueProcessResults.map((item, index) => (
                    <div key={`${item.id}-${item.process_label}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleProcess(index)}
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
                            <EmailContent email={item} />
                            <AnalysisSection email={item} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results State */}
            {uniqueProcessResults.length === 0 && !processing && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <AnalysisIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                <p className="text-gray-500 mb-6">
                  Process this email to see AI-powered analysis and insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show the email list view
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Inbox</h1>
          <p className="text-gray-600 mt-2">Manage and process your emails with AI analysis</p>
        </div>

        {loading ? (
          <EmailListSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['RecId', 'Subject', 'From', 'Date', 'Actions'].map((column) => (
                      <th
                        key={column}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(column === 'Actions' ? 'CreatedDateTime' : column)}
                      >
                        <div className="flex items-center gap-1">
                          {column}
                          {orderBy === (column === 'Actions' ? 'CreatedDateTime' : column) && (
                            <span className="text-gray-400">
                              {orderDir === 0 ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.map((email) => (
                    <tr 
                      key={email.RecId} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleOpenEmail(email)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded font-mono">
                          {email.RecId}
                        </code>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="text-sm font-medium text-gray-900 truncate" title={email.Subject}>
                          {email.Subject || 'No Subject'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-xs" title={email.From}>
                          {email.From}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(email.CreatedDateTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEmail(email);
                          }}
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {emails.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MailIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </button>
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
            Page {page}
          </span>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Skeleton Components
const EmailListSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['RecId', 'Subject', 'From', 'Date', 'Actions'].map((column) => (
              <th key={column} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-9 bg-gray-200 rounded w-16 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Icons
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ProcessIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const AnalysisIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);