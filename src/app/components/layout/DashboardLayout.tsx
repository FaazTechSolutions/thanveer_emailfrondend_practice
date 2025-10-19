// components/layout/DashboardLayout.tsx
interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
}

export const DashboardLayout = ({ sidebar, mainContent }: DashboardLayoutProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          {sidebar}
        </div>
        <div className="lg:w-2/3">
          {mainContent}
        </div>
      </div>
    </div>
  );
};