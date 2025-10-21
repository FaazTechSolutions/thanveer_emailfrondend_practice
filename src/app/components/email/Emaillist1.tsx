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
import { EmailListSkeleton } from "../ui/EmailListSkeleton";
import { ArrowLeftIcon, ArrowRightIcon, MailIcon } from "../ui/Icons";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  orderBy: string;
  orderDir: 0 | 1;
  page: number;
  onSort: (column: string) => void;
  onOpenEmail: (email: Email) => void;
  onPageChange: (page: number) => void;
}

export function EmailList({ 
  emails, 
  loading, 
  orderBy, 
  orderDir, 
  page, 
  onSort, 
  onOpenEmail, 
  onPageChange 
}: EmailListProps) {
  const columns = ['RecId', 'Subject', 'From', 'Date', 'Actions'];

  if (loading) {
    return <EmailListSkeleton />;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onSort(column === 'Actions' ? 'CreatedDateTime' : column)}
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
                  onClick={() => onOpenEmail(email)}
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
                        onOpenEmail(email);
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

      <Pagination page={page} onPageChange={onPageChange} />
    </>
  );
}

function Pagination({ page, onPageChange }: { page: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        disabled={page === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Previous
      </button>
      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
        Page {page}
      </span>
      <button
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}