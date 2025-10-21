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
import { ProcessIcon, CalendarIcon, UserIcon, UsersIcon } from "../ui/Icons";
import { LoadingSpinner } from "../ui/LoadingSpinner";


interface EmailHeaderProps {
  email: Email;
  processing: boolean;
  onProcessEmail: () => void;
}

export function EmailHeader({ email, processing, onProcessEmail }: EmailHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {email.Subject}
        </h1>
        <button
          onClick={onProcessEmail}
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
          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{email.RecId}</code>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <strong className="text-gray-700">Date:</strong>
          <span>{new Date(email.CreatedDateTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <strong className="text-gray-700">From:</strong> 
          <span className="truncate">{email.From}</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-gray-400" />
          <strong className="text-gray-700">To:</strong> 
          <span className="truncate">
            {email.ToRecipients.split(',').slice(0, 2).join(', ')}
            {email.ToRecipients.split(',').length > 2 && (
              <button 
                className="ml-1 text-blue-600 hover:text-blue-800 text-xs underline"
                onClick={() => {
                  alert(`All recipients: ${email.ToRecipients}`);
                }}
              >
                +{email.ToRecipients.split(',').length - 2} more
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}