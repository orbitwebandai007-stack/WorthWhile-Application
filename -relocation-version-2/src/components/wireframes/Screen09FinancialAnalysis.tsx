import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, ArrowLeft, TrendingUp, DollarSign, PieChart, ShieldCheck, Edit3, RotateCcw } from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';
import { ExpenseCategory } from '../../types';

export const Screen09FinancialAnalysis: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  chosenNeighbourhood,
  verdict,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  
  const inHand = state.sal || 174500;
  const grossMonthly = Math.round(((state.annualLpa || 28) * 100000) / 12);
  const deductions = grossMonthly - inHand;
  const livingOutflow = chosenNeighbourhood.x.tot;
  const fixedCommitments = state.com || 25000;
  const netMonthlySurplus = Math.max(0, inHand - livingOutflow - fixedCommitments);
  const savingsRate = Math.round((netMonthlySurplus / inHand) * 100);

  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);

  const expenseItems = [
    { key: 'rent' as ExpenseCategory, label: 'Rent & Maintenance', amount: chosenNeighbourhood.x.e.rent, note: `${state.prop.toUpperCase()} in ${chosenNeighbourhood.a[0]}` },
    { key: 'food' as ExpenseCategory, label: 'Food & Groceries', amount: chosenNeighbourhood.x.e.food, note: `Habit: ${state.food.toUpperCase()}` },
    { key: 'trans' as ExpenseCategory, label: 'Daily Commute & Fuel/Cabs', amount: chosenNeighbourhood.x.e.trans, note: `Mode: ${state.tr.toUpperCase()} (~${chosenNeighbourhood.peakMin || 20}m peak)` },
    { key: 'util' as ExpenseCategory, label: 'Utilities (Electricity, Water, AC)', amount: chosenNeighbourhood.x.e.util, note: 'Includes summer AC calibration' },
    { key: 'net' as ExpenseCategory, label: 'High-Speed Broadband & Mobile', amount: chosenNeighbourhood.x.e.net, note: 'Fiber broadband + 5G unlimited' },
    { key: 'pers' as ExpenseCategory, label: 'Personal & Domestic Help', amount: chosenNeighbourhood.x.e.pers, note: 'House cleaning & laundry support' },
    { key: 'ent' as ExpenseCategory, label: 'Entertainment & Dining Out', amount: chosenNeighbourhood.x.e.ent, note: 'Weekend social & leisure' },
    { key: 'oth' as ExpenseCategory, label: 'Discretionary Safety Buffer', amount: chosenNeighbourhood.x.e.oth, note: 'Unplanned contingencies' },
  ];

  const handleStartEdit = (cat: ExpenseCategory, currentVal: number) => {
    setEditingCategory(cat);
    setTempValue(currentVal);
  };

  const handleSaveEdit = (cat: ExpenseCategory) => {
    onUpdateState({
      ov: {
        ...(state.ov || {}),
        [cat]: tempValue,
      },
    });
    setEditingCategory(null);
  };

  const handleResetOverrides = () => {
    onUpdateState({ ov: {} });
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
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                FINANCIAL AUDIT · RECURRING MONTHLY CASHFLOW
              </span>
              <h1 className="text-xl font-bold text-[#18231E]">
                Monthly Financial Waterfall & Living Expense Breakdown
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5F6A63]">Target Corridor:</span>
              <span className="px-2.5 py-1 bg-white border border-[#E2E5E9] rounded-lg text-xs font-bold text-[#18231E]">
                {chosenNeighbourhood.a[0]} ({state.prop.toUpperCase()})
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            Granular ledger of recurring living costs in {currentCityData.name}. Fully transparent benchmarks with support for custom overrides.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(7)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Corridors</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">In-Hand:</span>
              <span className="font-bold text-[#18231E] font-mono text-xs">{formatINR(inHand)}</span>
              <span className="text-[#8C9690]">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Surplus:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                +{formatINR(netMonthlySurplus)}/mo ({savingsRate}%)
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(10)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to What-If Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Top Cashflow Waterfall Strip */}
          <div className="mt-6 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-[#F0F2F4]">
              <span className="text-[#5F6A63]">
                MONTHLY CASHFLOW WATERFALL (₹{state.annualLpa || 28} LPA CTC)
              </span>
              <span className="text-[#176B50] font-bold">
                NET ACCRUAL: {savingsRate}% SAVINGS RATE
              </span>
            </div>

            {/* Visual Waterfall Bar */}
            <div className="w-full h-9 bg-[#F3F4F6] rounded-lg overflow-hidden flex my-4 border border-[#E2E5E9] text-xs font-semibold text-white text-center leading-9">
              <div style={{ width: '25%' }} className="bg-[#5F6A63]" title="Taxes & EPF">
                Taxes ({formatINR(deductions)})
              </div>
              <div style={{ width: '12%' }} className="bg-[#47544C]" title="Fixed EMI Commitments">
                EMI ({formatINR(fixedCommitments)})
              </div>
              <div style={{ width: '18%' }} className="bg-[#1E3A8A]" title="Rent & Maintenance">
                Rent ({formatINR(chosenNeighbourhood.x.e.rent)})
              </div>
              <div style={{ width: '15%' }} className="bg-[#0284C7]" title="Living & Utilities">
                Living ({formatINR(livingOutflow - chosenNeighbourhood.x.e.rent)})
              </div>
              <div style={{ width: '30%' }} className="bg-[#176B50]" title="Net Monthly Surplus">
                Net Savings (+{formatINR(netMonthlySurplus)})
              </div>
            </div>

            {/* Waterfall Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-[#F8F9FA] rounded border border-[#E2E5E9]">
                <span className="text-[#5F6A63] text-[10px] block">Gross Monthly</span>
                <strong className="text-[#18231E]">{formatINR(grossMonthly)}</strong>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] rounded border border-[#E2E5E9]">
                <span className="text-[#5F6A63] text-[10px] block">Post-Tax In-Hand</span>
                <strong className="text-[#18231E]">{formatINR(inHand)}</strong>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] rounded border border-[#E2E5E9]">
                <span className="text-[#5F6A63] text-[10px] block">Fixed Commitments</span>
                <strong className="text-[#C2410C]">-{formatINR(fixedCommitments)}</strong>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] rounded border border-[#E2E5E9]">
                <span className="text-[#5F6A63] text-[10px] block">{currentCityData.name} Living Burn</span>
                <strong className="text-[#C2410C]">-{formatINR(livingOutflow)}</strong>
              </div>
              <div className="p-2.5 bg-[#E8F4EF] rounded border border-[#176B50]/30 col-span-2 sm:col-span-1">
                <span className="text-[#176B50] text-[10px] block font-bold">Monthly Surplus</span>
                <strong className="text-[#176B50] text-sm">+{formatINR(netMonthlySurplus)}</strong>
              </div>
            </div>
          </div>

          {/* 2-Column Split: Detailed Itemized Expense Ledger vs Current City Delta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Itemized Living Outflow Ledger */}
            <div className="lg:col-span-7 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E5E9]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#18231E]">
                  Itemized Monthly Cost Ledger ({chosenNeighbourhood.a[0]})
                </h3>
                {Object.keys(state.ov || {}).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetOverrides}
                    className="text-[10px] font-mono text-[#C2410C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Overrides</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#F0F2F4] text-xs">
                {expenseItems.map((item) => (
                  <div key={item.key} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#18231E] block">{item.label}</span>
                      <span className="text-[11px] text-[#5F6A63]">{item.note}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingCategory === item.key ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(Number(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-xs border border-[#176B50] rounded font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.key)}
                            className="px-2 py-1 bg-[#176B50] text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-mono font-bold text-[#18231E]">
                            {formatINR(item.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item.key, item.amount)}
                            className="p-1 text-[#5F6A63] hover:text-[#18231E] cursor-pointer"
                            title="Edit Assumption"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Origin vs Destination Wealth Delta */}
            <div className="lg:col-span-5 bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
                  <span className="font-mono text-xs font-bold text-[#18231E] uppercase">
                    NET SAVINGS DELTA ({state.from} vs {currentCityData.name})
                  </span>
                  <span className="text-[10px] font-mono text-[#176B50] font-bold">
                    ANNUAL WEALTH ACCRUAL
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#E8F4EF] border border-[#176B50]/30 mt-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold block">
                    Incremental Monthly Gain
                  </span>
                  <div className="text-3xl font-black text-[#176B50]">
                    +{formatINR(verdict.savingsDeltaMonthly)}<span className="text-xs font-normal">/mo</span>
                  </div>
                  <p className="text-xs text-[#18231E] leading-relaxed">
                    Moving to {currentCityData.name} produces <strong>{formatINR(verdict.savingsDeltaMonthly * 12)}</strong> additional liquid surplus annually compared to remaining in {state.from}.
                  </p>
                </div>

                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">{state.from} Current Monthly Surplus:</span>
                    <strong className="text-[#18231E]">{formatINR(verdict.currentSavings)}/mo</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">{currentCityData.name} Target Monthly Surplus:</span>
                    <strong className="text-[#176B50]">+{formatINR(verdict.destSavings)}/mo</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F0F2F4]">
                    <span className="text-[#5F6A63]">Sunk Moving Costs Recovery:</span>
                    <strong className="text-[#18231E]">{verdict.economicPaybackMonths ? `${verdict.economicPaybackMonths} months` : 'N/A'}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(10)}
                className="w-full py-2.5 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Simulate What-If Relocation Scenarios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
