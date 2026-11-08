import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, ArrowLeft, Sliders, TrendingUp, Check, AlertTriangle, Layers, Percent, Sparkles } from 'lucide-react';
import { CITIES, formatINR, calculateWealthProjection } from '../../data/relocationData';

export const Screen10WhatIfScenarios: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  chosenNeighbourhood,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;

  const [hybridDays, setHybridDays] = useState(3);
  const [rentInflation, setRentInflation] = useState(10);
  const [flatShare, setFlatShare] = useState(false);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(10); // 10% mutual fund CAGR

  // Baseline rent & commute
  const baseRent = chosenNeighbourhood.x.e.rent;
  const baseCommute = chosenNeighbourhood.x.e.trans;
  
  // Adjusted rent with flat sharing
  const adjustedRent = flatShare ? Math.round(baseRent * 0.5) : baseRent;
  
  // Adjusted commute with hybrid attendance (5 days is 100%, 3 days is 60%, 2 days is 40%)
  const commuteFactor = hybridDays / 5;
  const adjustedCommute = Math.round(baseCommute * (0.3 + 0.7 * commuteFactor));
  
  // Total adjusted monthly living outflow
  const otherExpenses = chosenNeighbourhood.x.tot - baseRent - baseCommute;
  const adjustedLivingOutflow = adjustedRent + adjustedCommute + otherExpenses;

  // Monthly surplus under simulated scenario
  const inHand = state.sal || 174500;
  const commitments = state.com || 25000;
  const adjustedMonthlySurplus = Math.max(0, inHand - adjustedLivingOutflow - commitments);
  const baselineSurplus = Math.max(0, inHand - chosenNeighbourhood.x.tot - commitments);
  const monthlyDelta = adjustedMonthlySurplus - baselineSurplus;

  // 3-Year Cumulative Wealth Projection
  const wealth3Yr = calculateWealthProjection(adjustedMonthlySurplus, 36, investmentReturnRate).totalWealth;
  const wealth1Yr = calculateWealthProjection(adjustedMonthlySurplus, 12, investmentReturnRate).totalWealth;

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
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                SENSITIVITY ANALYSIS · SCENARIO STRESS TEST
              </span>
              <h1 className="text-xl font-bold text-[#18231E]">
                What-If Relocation Scenarios & Long-Term Sensitivity
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#E8F4EF] text-[#176B50] text-xs font-semibold rounded-lg font-mono">
                Base Case: {chosenNeighbourhood.a[0]} ({formatINR(baselineSurplus)}/mo)
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            Simulate how changes in office policy (hybrid vs 5-day), annual rent inflation, and flatmate sharing affect your 3-year wealth accumulation in {currentCityData.name}.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(9)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Financial Analysis</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Simulated 3-Yr Wealth:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {formatINR(wealth3Yr)}
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Scenario Surplus: <strong className="text-[#18231E] font-mono">{formatINR(adjustedMonthlySurplus)}/mo</strong></span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(11)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to Relocation Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Scenario Controls Bar */}
          <div className="mt-6 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Variable 1: Hybrid Office Attendance */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#18231E] uppercase text-[11px]">1. Office Commute Frequency</span>
                  <span className="font-mono text-[#176B50] font-bold">{hybridDays} Days / Week</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[2, 3, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setHybridDays(d)}
                      className={`py-2 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                        hybridDays === d
                          ? 'border-[#176B50] bg-[#E8F4EF] text-[#176B50] font-bold'
                          : 'border-[#E2E5E9] bg-white text-[#5F6A63]'
                      }`}
                    >
                      {d === 5 ? '5 Days (Full)' : `${d} Days (Hybrid)`}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#5F6A63] block">
                  {hybridDays < 5
                    ? `Saves ~${formatINR(baseCommute - adjustedCommute)}/mo in transit burn and reduces gridlock fatigue.`
                    : 'Full 5-day office attendance with standard commute expense.'}
                </span>
              </div>

              {/* Variable 2: Annual Rent Escalation Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#18231E] uppercase text-[11px]">2. Annual Rent Hike</span>
                  <span className="font-mono text-[#C2410C] font-bold">+{rentInflation}% / year</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[5, 10, 15].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRentInflation(r)}
                      className={`py-2 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                        rentInflation === r
                          ? 'border-[#C2410C] bg-[#FFEDD5] text-[#C2410C] font-bold'
                          : 'border-[#E2E5E9] bg-white text-[#5F6A63]'
                      }`}
                    >
                      +{r}% / yr
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#5F6A63] block">
                  {currentCityData.name} tech corridors historically experience 8%–10% lease renewal hikes.
                </span>
              </div>

              {/* Variable 3: Flat Sharing with Colleague */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#18231E] uppercase text-[11px]">3. Accommodation Strategy</span>
                  <span className="font-mono text-[#18231E] font-bold">{flatShare ? 'Roommate (50% Split)' : 'Solo Lease'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFlatShare(false)}
                    className={`py-2 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                      !flatShare
                        ? 'border-[#176B50] bg-[#E8F4EF] text-[#176B50] font-bold'
                        : 'border-[#E2E5E9] bg-white text-[#5F6A63]'
                    }`}
                  >
                    Solo Lease (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlatShare(true)}
                    className={`py-2 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                      flatShare
                        ? 'border-[#176B50] bg-[#E8F4EF] text-[#176B50] font-bold'
                        : 'border-[#E2E5E9] bg-white text-[#5F6A63]'
                    }`}
                  >
                    Share 2BHK (50%)
                  </button>
                </div>
                <span className="text-[10px] text-[#5F6A63] block">
                  {flatShare
                    ? `Sharing with a colleague cuts rent by ${formatINR(baseRent - adjustedRent)}/mo.`
                    : 'Sole financial responsibility for the lease.'}
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Split: Dynamic Scenario Impact Matrix vs 3-Year Wealth Accumulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Adjusted Scenario Cashflow Ledger */}
            <div className="lg:col-span-6 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E5E9]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#18231E]">
                  Simulated Monthly Cashflow Impact
                </h3>
                <span className="text-[10px] font-mono text-[#176B50] font-bold">
                  {monthlyDelta >= 0 ? `+${formatINR(monthlyDelta)}/mo gain` : `-${formatINR(Math.abs(monthlyDelta))}/mo`}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                  <span className="text-[#5F6A63]">Monthly Rent (Effective):</span>
                  <span className="font-mono font-bold text-[#18231E]">
                    {formatINR(adjustedRent)}/mo {flatShare && <span className="text-[#176B50] font-normal">(-50% share)</span>}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                  <span className="text-[#5F6A63]">Commute & Fuel Burn:</span>
                  <span className="font-mono font-bold text-[#18231E]">
                    {formatINR(adjustedCommute)}/mo ({hybridDays} days/wk)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                  <span className="text-[#5F6A63]">Other Utilities & Groceries:</span>
                  <span className="font-mono text-[#18231E]">{formatINR(otherExpenses)}/mo</span>
                </div>

                <div className="flex justify-between py-2 bg-[#E8F4EF] px-3 rounded-lg border border-[#176B50]/30">
                  <span className="font-bold text-[#176B50]">Adjusted Monthly Disposable Surplus:</span>
                  <span className="font-mono font-black text-[#176B50] text-sm">
                    +{formatINR(adjustedMonthlySurplus)}/mo
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9] text-[11px] text-[#5F6A63]">
                💡 In this scenario, your monthly savings rate increases from <strong>{Math.round((baselineSurplus / inHand) * 100)}%</strong> to <strong>{Math.round((adjustedMonthlySurplus / inHand) * 100)}%</strong> of take-home income.
              </div>
            </div>

            {/* Right Column: 3-Year Wealth Accumulation Schedule */}
            <div className="lg:col-span-6 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-[#E2E5E9]">
                  <span className="font-mono text-xs font-bold text-[#18231E] uppercase">
                    3-YEAR WEALTH ACCUMULATION (COMPOUNDED)
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <span className="text-[#5F6A63]">CAGR:</span>
                    <select
                      value={investmentReturnRate}
                      onChange={(e) => setInvestmentReturnRate(Number(e.target.value))}
                      className="border border-[#E2E5E9] rounded px-1.5 py-0.5 bg-[#F8F9FA] font-bold text-[#176B50]"
                    >
                      <option value={6}>6% (FD / Debt)</option>
                      <option value={10}>10% (Index Funds)</option>
                      <option value={12}>12% (Equity Mutual Funds)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F9F6] border border-[#176B50]/30 mt-3 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold block">
                    36-Month Projected Wealth Created
                  </span>
                  <div className="text-3xl font-black text-[#176B50]">
                    {formatINR(wealth3Yr)}
                  </div>
                  <p className="text-xs text-[#5F6A63]">
                    Assuming surplus is systematically deployed at {investmentReturnRate}% annual returns, accounting for {rentInflation}% annual rent hikes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9]">
                    <span className="text-[10px] text-[#5F6A63] block">12 Months (Year 1)</span>
                    <strong className="text-[#18231E] text-sm">{formatINR(wealth1Yr)}</strong>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9]">
                    <span className="text-[10px] text-[#5F6A63] block">36 Months (Year 3)</span>
                    <strong className="text-[#176B50] text-sm">{formatINR(wealth3Yr)}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(11)}
                className="w-full py-2.5 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Full Relocation Blueprint Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
