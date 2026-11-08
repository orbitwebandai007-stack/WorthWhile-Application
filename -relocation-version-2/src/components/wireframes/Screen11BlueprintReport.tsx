import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import {
  ArrowRight,
  ArrowLeft,
  Printer,
  Share2,
  CheckCircle,
  FileCheck,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert,
  Download,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { CITIES, formatINR, calculateWealthProjection } from '../../data/relocationData';

export const Screen11BlueprintReport: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  chosenNeighbourhood,
  movingCosts,
  verdict,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  const currentWp = state.wp || { name: 'Outer Ring Road (EcoSpace)', lat: 12.926, lng: 77.683 };
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const monthlySurplus = Math.max(0, (state.sal || 174500) - chosenNeighbourhood.x.tot - (state.com || 25000));
  const wealth3Yr = calculateWealthProjection(monthlySurplus, 36, 10).totalWealth;

  const handleSaveToPortfolio = () => {
    try {
      const existingStr = localStorage.getItem('ri_completed_reports');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newPlan = {
        id: `plan_${Date.now()}`,
        archivedAt: new Date().toISOString(),
        origin: state.from,
        city: currentCityData.name,
        cityKey: state.city,
        workplace: currentWp.name,
        corridor: chosenNeighbourhood.a[0],
        annualLpa: state.annualLpa || 28,
        inHandSalary: state.sal || 174500,
        monthlySurplus: Math.max(0, (state.sal || 174500) - chosenNeighbourhood.x.tot - (state.com || 25000)),
        day1Cash: movingCosts.totalDay1CashRequired,
        sunkCost: movingCosts.totalNonRecoverableCost,
        stateSnapshot: state,
      };

      localStorage.setItem('ri_completed_reports', JSON.stringify([newPlan, ...existing.slice(0, 9)]));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('Failed to save plan', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Blueprint"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={currentCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-7">
        <div>
          {/* Document Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#18231E] text-white flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-[#176B50] text-white px-2 py-0.5 rounded font-bold">
                    EXECUTIVE AUDIT DOSSIER
                  </span>
                  <span className="text-xs font-mono text-[#5F6A63]">
                    DOC_ID: #{state.city.toUpperCase()}-{Date.now().toString().slice(-4)}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[#18231E]">
                  Worthwhile Relocation Decision Blueprint
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveToPortfolio}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#176B50]" />
                    <span className="text-[#176B50]">Saved to Portfolio!</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#5F6A63]" />
                    <span>Save to Portfolio</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export / Print Report</span>
              </button>
            </div>
          </div>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(10)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: What-If Scenarios</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Evaluation Verdict:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {verdict.badgeLabel}
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Surplus: <strong className="text-[#176B50] font-mono">+{formatINR(monthlySurplus)}/mo</strong></span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Payback: <strong className="text-[#18231E] font-mono">{verdict.economicPaybackMonths || 3.2} Mo</strong></span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Top Recommendation Verdict Banner */}
          <div className="mt-5 p-5 rounded-xl bg-[#E8F4EF] border-2 border-[#176B50] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#176B50] text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider block">
                  INTELLIGENT RELOCATION VERDICT
                </span>
                <h2 className="text-lg font-black text-[#176B50]">
                  VERDICT: {verdict.headline}
                </h2>
                <p className="text-xs text-[#18231E] max-w-3xl mt-0.5 leading-relaxed">
                  Moving to {currentCityData.name} for <strong>₹{state.annualLpa || 28}.0 LPA</strong> generates <strong>+{formatINR(verdict.savingsDeltaMonthly)}/mo</strong> additional disposable surplus over your {state.from} base. All non-recoverable relocation expenses ({formatINR(movingCosts.totalNonRecoverableCost)}) are recovered in <strong>{verdict.economicPaybackMonths || 1.4} months</strong>.
                </p>
              </div>
            </div>

            <div className="text-left md:text-right md:pl-6 md:border-l border-[#176B50]/20 shrink-0">
              <div className="text-2xl font-black text-[#176B50]">
                +{formatINR(verdict.savingsDeltaMonthly)}<span className="text-xs font-normal">/mo</span>
              </div>
              <span className="text-[10px] font-mono text-[#5F6A63] uppercase">
                Net Incremental Wealth Gain
              </span>
            </div>
          </div>

          {/* 3-Section Structured Executive Report Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Section 1: Capital Deployment Schedule */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2 border-b border-[#E2E5E9] flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#18231E]">
                  1. CAPITAL DEPLOYMENT SCHEDULE
                </span>
                <span className="text-[10px] font-mono text-[#C2410C] font-semibold">DAY-1 LIQUIDITY</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <div className="flex justify-between items-center font-bold text-[#18231E]">
                    <span>Category A: Recoverable Capital</span>
                    <span className="text-[#176B50]">{formatINR(movingCosts.totalRecoverableCapital)}</span>
                  </div>
                  <span className="text-[11px] text-[#5F6A63] block mt-0.5">
                    Security Deposit ({movingCosts.depositMonths} mo) + Refundable Utility Bonds
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <div className="flex justify-between items-center font-bold text-[#18231E]">
                    <span>Category B: Non-Recoverable Expenses</span>
                    <span className="text-[#C2410C]">{formatINR(movingCosts.totalNonRecoverableCost)}</span>
                  </div>
                  <span className="text-[11px] text-[#5F6A63] block mt-0.5">
                    Brokerage ({formatINR(movingCosts.brokerageFee)}) + Movers & Setup ({formatINR(movingCosts.moversPackers + movingCosts.initialSetupReserve)})
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F0F2F4] flex justify-between items-center font-bold text-xs">
                  <span className="text-[#18231E]">Total Day-1 Cash Outlay:</span>
                  <span className="font-mono text-sm text-[#C2410C]">
                    {formatINR(movingCosts.totalDay1CashRequired)}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Payback & Recovery Timeline */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2 border-b border-[#E2E5E9] flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#18231E]">
                  2. PAYBACK & RECOVERY METRICS
                </span>
                <span className="text-[10px] font-mono text-[#176B50] font-semibold">TIMELINE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6A63]">Economic Cost Recovery:</span>
                    <strong className="text-[#176B50] text-sm">
                      {verdict.economicPaybackMonths ? `${verdict.economicPaybackMonths} Months` : 'N/A'}
                    </strong>
                  </div>
                  <span className="text-[11px] text-[#5F6A63] block mt-0.5">
                    Time to recover sunk non-refundable moving expenses via incremental monthly savings.
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F0F2F4]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6A63]">Full Liquidity Recovery:</span>
                    <strong className="text-[#18231E] text-sm">
                      {verdict.liquidityPaybackMonths ? `${verdict.liquidityPaybackMonths} Months` : 'N/A'}
                    </strong>
                  </div>
                  <span className="text-[11px] text-[#5F6A63] block mt-0.5">
                    Time to replenish total upfront cash (including locked security deposit) back into bank.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#E8F4EF] text-[11px] text-[#176B50] font-medium">
                  ✓ High financial safety buffer. Move pays for itself within the first quarter.
                </div>
              </div>
            </div>

            {/* Section 3: Recurring Burn & 3-Year Wealth */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2 border-b border-[#E2E5E9] flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#18231E]">
                  3. LONG-TERM WEALTH ACCRUAL
                </span>
                <span className="text-[10px] font-mono text-[#176B50] font-semibold">3-YEAR OUTLOOK</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#F0F2F4]">
                  <span className="text-[#5F6A63]">Monthly Recurring Living Burn:</span>
                  <strong className="text-[#18231E]">{formatINR(chosenNeighbourhood.x.tot)}/mo</strong>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#F0F2F4]">
                  <span className="text-[#5F6A63]">Monthly Disposable Surplus:</span>
                  <strong className="text-[#176B50] text-sm">
                    +{formatINR(Math.max(0, (state.sal || 174500) - chosenNeighbourhood.x.tot - (state.com || 25000)))}/mo
                  </strong>
                </div>

                <div className="p-3 bg-[#F4F9F6] rounded-lg border border-[#176B50]/30">
                  <span className="text-[10px] font-mono uppercase text-[#176B50] block font-bold">
                    3-Year Wealth Created (10% CAGR)
                  </span>
                  <div className="text-xl font-black text-[#176B50] mt-1">
                    {formatINR(wealth3Yr)}
                  </div>
                  <span className="text-[10px] text-[#5F6A63] block mt-0.5">
                    Assumes surplus invested monthly with 10% rent renewal inflation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
