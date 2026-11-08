import React from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, ArrowLeft, Check, Star, AlertCircle, Info, Sparkles } from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';

export const Screen08AffordabilityCompare: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  scoredNeighbourhoods,
  chosenNeighbourhood,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  const currentWp = state.wp || { name: 'EcoSpace Business Park (ORR)', lat: 12.926, lng: 77.683 };

  // Get up to 3 shortlisted localities, or top 3 scored if none or fewer shortlisted
  const selectedLocalities = scoredNeighbourhoods.filter((n) =>
    (state.sel || []).includes(n.i)
  );

  const comparedList =
    selectedLocalities.length >= 2
      ? selectedLocalities.slice(0, 3)
      : scoredNeighbourhoods.slice(0, 3);

  const handleSetPrimary = (id: number) => {
    const currentSel = state.sel || [];
    onUpdateState({
      sel: [id, ...currentSel.filter((x) => x !== id)].slice(0, 3),
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Corridors"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={currentCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-7">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                DEEP DIVE COMPARATOR · {comparedList.length} CORRIDORS
              </span>
              <h1 className="text-xl font-bold text-[#18231E]">
                Locality Affordability & Trade-Off Comparison Matrix
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#E8F4EF] text-[#176B50] text-xs font-semibold rounded-lg font-mono">
                Office: {currentWp.name.split('·')[0]}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            Direct side-by-side comparison across monthly rent, upfront liquidity locks, peak commute hours, and resulting disposable wealth accrual in {currentCityData.name}.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(7)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Corridor Map</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Selected Corridors:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {comparedList.length} Localities
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Top Fit: <strong className="text-[#18231E]">{chosenNeighbourhood.a[0]}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(9)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to Financial Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Column Structured Comparative Matrix Table */}
          <div className="mt-6 bg-white border border-[#E2E5E9] rounded-xl overflow-hidden shadow-2xs">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-[#F8F9FA] border-b border-[#E2E5E9] text-xs font-bold text-[#18231E]">
              <div className="p-4 border-r border-[#E2E5E9] flex items-center">
                <span>EVALUATION METRICS</span>
              </div>

              {comparedList.map((area, idx) => {
                const isPrimary = chosenNeighbourhood.i === area.i;

                return (
                  <div
                    key={area.i}
                    className={`p-4 border-r border-[#E2E5E9] last:border-r-0 ${
                      isPrimary ? 'bg-[#E8F4EF]/60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#176B50]">{area.a[0]}</span>
                      <span className="text-[10px] font-mono bg-[#176B50] text-white px-1.5 py-0.5 rounded">
                        {isPrimary ? '★ PRIMARY' : `#${idx + 1} FIT`}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5F6A63] font-normal block mt-0.5 truncate">
                      {area.whyExplanation || area.why}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Matrix Data Rows */}
            <div className="divide-y divide-[#F0F2F4] text-xs">
              {/* Category 1: Housing & Deposit */}
              <div className="grid grid-cols-1 md:grid-cols-4 bg-[#FAFAFA] font-bold text-[11px] text-[#5F6A63] px-4 py-2 uppercase tracking-wider">
                <span>1. Housing & Liquidity Lock</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Monthly Rent ({state.prop.toUpperCase()})</span>
                {comparedList.map((area) => (
                  <span key={area.i} className="font-bold text-[#18231E] bg-[#E8F4EF]/40 px-2 py-1 rounded">
                    {formatINR(area.x.e.rent)} / mo
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Upfront Security Deposit (Locked)</span>
                {comparedList.map((area) => (
                  <span key={area.i} className="font-bold text-[#C2410C] bg-[#E8F4EF]/40 px-2 py-1 rounded">
                    {formatINR(area.depositRequired)} ({currentCityData.defaultDepositMonths} mo)
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Brokerage & Setup (Non-Refundable)</span>
                {comparedList.map((area) => (
                  <span key={area.i} className="font-medium text-[#18231E] bg-[#E8F4EF]/40 px-2 py-1 rounded">
                    {formatINR(area.x.e.rent)} brokerage + ₹20k setup
                  </span>
                ))}
              </div>

              {/* Category 2: Commute & Transit */}
              <div className="grid grid-cols-1 md:grid-cols-4 bg-[#FAFAFA] font-bold text-[11px] text-[#5F6A63] px-4 py-2 uppercase tracking-wider">
                <span>2. Commute & Daily Transit</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Peak Hour Commute</span>
                {comparedList.map((area) => (
                  <strong key={area.i} className="text-[#176B50]">
                    ~{area.peakMin || area.x.min} mins each way
                  </strong>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">OSRM Road Distance</span>
                {comparedList.map((area) => (
                  <span key={area.i} className="text-[#18231E]">
                    {area.roadKm || area.straightLineKm} km road ({area.straightLineKm} km air)
                  </span>
                ))}
              </div>

              {/* Category 3: Financial Surplus */}
              <div className="grid grid-cols-1 md:grid-cols-4 bg-[#FAFAFA] font-bold text-[11px] text-[#5F6A63] px-4 py-2 uppercase tracking-wider">
                <span>3. Monthly Financial Accrual</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Total Monthly Living Burn</span>
                {comparedList.map((area) => (
                  <strong key={area.i} className="text-[#C2410C]">
                    {formatINR(area.x.tot)} / mo
                  </strong>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Projected Disposable Surplus</span>
                {comparedList.map((area) => (
                  <strong key={area.i} className="text-[#176B50] text-sm">
                    +{formatINR(area.monthlySurplus)} / mo
                  </strong>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 p-4 items-center gap-2">
                <span className="text-[#5F6A63] font-medium">Worthwhile Fit Score</span>
                {comparedList.map((area) => (
                  <div key={area.i} className="flex items-center justify-between">
                    <span className="text-base font-black text-[#176B50]">{area.sc}/100</span>
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(area.i)}
                      className="px-2.5 py-1 rounded bg-[#18231E] hover:bg-[#176B50] text-white text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Set Primary
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
