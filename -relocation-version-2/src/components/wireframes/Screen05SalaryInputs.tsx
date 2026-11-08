import React, { useState, useEffect } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, ArrowLeft, IndianRupee, ShieldCheck, Info, Calculator, Percent, Sparkles } from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';
import { lpaToMonthlyInHand } from '../OnboardingExperience';

export const Screen05SalaryInputs: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onStartNewPlan,
}) => {
  const [ctcLpa, setCtcLpa] = useState<number>(state.annualLpa || 28);
  const [commitments, setCommitments] = useState<number>(state.com || 25000);
  const [savingsTarget, setSavingsTarget] = useState<number>(
    state.tm === 'target' && state.tgt ? Math.round((state.tgt / (state.sal || 1)) * 100) : 40
  );
  const [currentCitySal, setCurrentCitySal] = useState<number>(state.currentSal || 128000);

  const currentCityData = CITIES[state.city] || CITIES.blr;

  // Real Indian New Tax Regime Math
  const grossMonthly = Math.round((ctcLpa * 100000) / 12);
  const netInHand = lpaToMonthlyInHand(ctcLpa);
  const estimatedDeductions = grossMonthly - netInHand;
  const disposableAfterCommitments = Math.max(0, netInHand - commitments);
  const targetSavingsAmount = Math.round((netInHand * savingsTarget) / 100);
  const availableHousingBudget = Math.max(0, disposableAfterCommitments - targetSavingsAmount);

  // Sync to parent state whenever inputs change
  useEffect(() => {
    onUpdateState({
      annualLpa: ctcLpa,
      sal: netInHand,
      com: commitments,
      currentSal: currentCitySal,
      tgt: targetSavingsAmount,
      tm: 'target',
    });
  }, [ctcLpa, commitments, savingsTarget, currentCitySal]);

  const handleNext = () => {
    onNavigate(6); // Advance to Screen 06 (Lifestyle & Housing)
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Compensation"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={currentCityData.name}
        annualLpa={ctcLpa}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-7">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                COMPENSATION AUDIT · FINANCIAL BASE & COMMITMENTS
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#18231E]">
                Define your offered compensation, existing commitments and savings targets
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6A63]">Destination:</span>
              <strong className="text-[#18231E]">
                {currentCityData.name} ({state.wp?.name.split('·')[0] || 'Tech Hub'})
              </strong>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            We convert your annual Cost-to-Company (CTC) into realistic post-tax monthly in-hand liquidity, accounting for EPF, standard deduction, and income tax slabs under the Union Budget New Tax Regime.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(4)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Workplace Location</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">In-Hand Cash:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {formatINR(netInHand)}/mo
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Savings Goal: <strong className="text-[#18231E] font-mono">{savingsTarget}%</strong></span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to Lifestyle & Accommodation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2-Column Grid: Input Controls vs Live Financial Telemetry Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 bg-white border border-[#E2E5E9] rounded-xl p-6 shadow-2xs space-y-6">
              {/* Field 1: Annual Offered CTC */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                    Offered Annual CTC (Lakhs Per Annum)
                  </label>
                  <span className="font-mono text-xs font-bold text-[#176B50]">
                    ₹{ctcLpa.toFixed(1)} LPA
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5F6A63]">₹</span>
                    <input
                      type="number"
                      min={3}
                      max={200}
                      value={ctcLpa}
                      onChange={(e) => setCtcLpa(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-12 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-lg text-sm font-bold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5F6A63]">LPA</span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[18, 24, 28, 35, 45].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCtcLpa(val)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                          ctcLpa === val
                            ? 'bg-[#18231E] text-white'
                            : 'bg-[#F3F4F6] text-[#5F6A63] hover:text-[#18231E]'
                        }`}
                      >
                        {val}L
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 2: Fixed Monthly Commitments & EMIs */}
              <div className="space-y-2 pt-4 border-t border-[#F0F2F4]">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                    Fixed Monthly Debt / EMI Commitments
                  </label>
                  <span className="font-mono text-xs font-bold text-[#C2410C]">
                    {formatINR(commitments)}/mo
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6A63]">
                  Home loans, car EMIs, education loans, or parents' allowance that you must service every month.
                </p>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5F6A63]">₹</span>
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={commitments}
                      onChange={(e) => setCommitments(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-12 py-2 bg-[#F8F9FA] border border-[#E2E5E9] rounded-lg text-xs font-bold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5F6A63]">/mo</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[0, 15000, 25000, 40000].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCommitments(c)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                          commitments === c
                            ? 'bg-[#18231E] text-white'
                            : 'bg-[#F3F4F6] text-[#5F6A63] hover:text-[#18231E]'
                        }`}
                      >
                        {c === 0 ? 'None' : `₹${c / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 3: Target Monthly Savings Rate */}
              <div className="space-y-2 pt-4 border-t border-[#F0F2F4]">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                    Target Savings Goal
                  </label>
                  <span className="font-mono text-xs font-bold text-[#176B50]">
                    {savingsTarget}% ({formatINR(targetSavingsAmount)}/mo)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={70}
                  step={5}
                  value={savingsTarget}
                  onChange={(e) => setSavingsTarget(Number(e.target.value))}
                  className="w-full accent-[#176B50] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#5F6A63]">
                  <span>10% (Minimal)</span>
                  <span>40% (Recommended Standard)</span>
                  <span>70% (Aggressive FIRE)</span>
                </div>
              </div>

              {/* Field 4: Current City Baseline Comparison */}
              <div className="space-y-2 pt-4 border-t border-[#F0F2F4]">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                    Current In-Hand Salary in {state.from}
                  </label>
                  <span className="font-mono text-xs font-bold text-[#5F6A63]">
                    {formatINR(currentCitySal)}/mo
                  </span>
                </div>
                <input
                  type="number"
                  step={5000}
                  value={currentCitySal}
                  onChange={(e) => setCurrentCitySal(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E2E5E9] rounded-lg text-xs font-semibold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                />
              </div>
            </div>

            {/* Right Column: Live Financial Telemetry Breakdown */}
            <div className="lg:col-span-5 bg-white border border-[#E2E5E9] rounded-xl p-6 shadow-2xs space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-[#E2E5E9]">
                  <span className="font-mono text-xs font-bold text-[#18231E] uppercase">
                    MONTHLY CASHFLOW AUDIT
                  </span>
                  <span className="text-[10px] font-mono text-[#176B50] bg-[#E8F4EF] px-2 py-0.5 rounded font-bold">
                    NEW TAX REGIME
                  </span>
                </div>

                {/* Waterfall Telemetry List */}
                <div className="space-y-3 mt-4 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">Gross Monthly CTC</span>
                    <span className="font-mono font-bold text-[#18231E]">{formatINR(grossMonthly)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">EPF & Income Tax Slabs</span>
                    <span className="font-mono text-[#C2410C]">-{formatINR(estimatedDeductions)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-[#E8F4EF]/50 px-2 rounded-lg border border-[#176B50]/20">
                    <span className="font-bold text-[#176B50]">Net Post-Tax In-Hand</span>
                    <span className="font-mono font-black text-[#176B50] text-sm">{formatINR(netInHand)}/mo</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">Debt / Loan Service Commitments</span>
                    <span className="font-mono text-[#C2410C]">-{formatINR(commitments)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">Target Wealth Savings ({savingsTarget}%)</span>
                    <span className="font-mono text-[#176B50]">-{formatINR(targetSavingsAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-[#18231E]">Allowable Living & Rent Budget</span>
                    <span className="font-mono font-black text-[#18231E] text-base">{formatINR(availableHousingBudget)}/mo</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9] text-[11px] text-[#5F6A63] leading-relaxed">
                ✓ With <strong>{formatINR(availableHousingBudget)}/mo</strong> allowable budget, you can comfortably afford 1BHK or 2BHK apartments in premium tech corridors while meeting your {savingsTarget}% savings target.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
