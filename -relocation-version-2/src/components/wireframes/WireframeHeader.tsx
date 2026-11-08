import React from 'react';

interface WireframeHeaderProps {
  activeNav?: string;
  onNavigate?: (screenIndex: number) => void;
  showProfile?: boolean;
  fromCity?: string;
  destCityName?: string;
  annualLpa?: number;
  onStartNewPlan?: () => void;
}

export const WireframeHeader: React.FC<WireframeHeaderProps> = ({
  activeNav = 'Dashboard',
  onNavigate,
  showProfile = true,
  fromCity = 'Lucknow',
  destCityName = 'Bengaluru',
  annualLpa = 28,
  onStartNewPlan,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Overview', screen: 1 },
    { label: 'Workplace', screen: 4 },
    { label: 'Compensation', screen: 5 },
    { label: 'Corridors', screen: 7 },
    { label: 'Blueprint', screen: 11 },
    { label: 'Dashboard', screen: 2 },
    { label: 'Saved Plans', screen: 12 },
  ];

  return (
    <header className="w-full bg-white border-b border-[#E2E5E9] px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 select-none sticky top-0 z-40">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          onClick={() => onNavigate?.(1)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Logo Mark */}
          <div className="w-7 h-7 rounded-lg bg-[#18231E] flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#18231E] leading-tight">
              Worthwhile
            </span>
            <span className="text-[9px] font-mono tracking-wider uppercase text-[#176B50] font-semibold">
              Relocation Intelligence
            </span>
          </div>
        </div>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-[#E2E5E9]">
          {navItems.map((item) => {
            const isActive = activeNav.toLowerCase() === item.label.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate?.(item.screen)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#E8F4EF] text-[#176B50] font-semibold'
                    : 'text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F3F4F6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Active Relocation Journey Box */}
      <div className="flex items-center">
        {showProfile && (
          <div
            onClick={() => onNavigate?.(2)}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#F0F4F2] border border-[#E2E5E9] text-xs cursor-pointer transition-colors shadow-2xs group"
            title="Open Active Evaluation Dashboard"
          >
            <span className="w-2 h-2 rounded-full bg-[#176B50] animate-pulse shrink-0" />
            <span className="text-[#5F6A63] font-mono text-[11px] font-medium hidden sm:inline">ACTIVE:</span>
            <span className="font-semibold text-[#18231E] group-hover:text-[#176B50] transition-colors">
              {fromCity} ➔ {destCityName}
            </span>
            <span className="text-[#8C9690]">•</span>
            <span className="font-mono text-[#176B50] font-bold">₹{annualLpa} LPA</span>
          </div>
        )}
      </div>
    </header>
  );
};
