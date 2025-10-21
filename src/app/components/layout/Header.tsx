// components/layout/Header.tsx
interface HeaderProps {
  emailCount: number;
  onRefresh: () => void;
  refreshing?: boolean;
}

export const Header = ({ emailCount, onRefresh, refreshing = false }: HeaderProps) => {
  return (
    <header className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email Intelligence Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered email analysis and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {emailCount} emails
            </span>
            <button 
              onClick={onRefresh}
              disabled={refreshing}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};