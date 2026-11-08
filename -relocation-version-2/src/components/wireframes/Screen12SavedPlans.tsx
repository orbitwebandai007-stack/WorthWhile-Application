import React, { useState, useEffect } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { Plus, ArrowRight, ArrowLeft, Clock, MapPin, Building, FileText, CheckCircle2, Trash2, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';

export const Screen12SavedPlans: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;

  const [savedPlans, setSavedPlans] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('ri_completed_reports');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    // Default sample portfolio if none saved yet
    return [
      {
        id: 'plan_active',
        city: 'Bengaluru',
        cityKey: 'blr',
        corridor: 'Outer Ring Road (EcoSpace Bellandur)',
        origin: 'Lucknow, UP',
        annualLpa: 28,
        inHandSalary: 174500,
        monthlySurplus: 102100,
        status: 'Ready · Blueprint Generated',
        statusColor: 'text-[#176B50] bg-[#E8F4EF]',
        stage: 'Stage 6 of 6',
        progress: 100,
        updated: 'Just now',
        isActive: true,
        topLocality: 'HSR Layout (Sector 2)',
        commute: '18 min peak',
      },
      {
        id: 'plan_ncr',
        city: 'Delhi NCR',
        cityKey: 'ncr',
        corridor: 'DLF Cyber City Hub',
        origin: 'Lucknow, UP',
        annualLpa: 30,
        inHandSalary: 184000,
        monthlySurplus: 94500,
        status: 'In Progress · Lifestyle Setup',
        statusColor: 'text-[#1E3A8A] bg-[#DBEAFE]',
        stage: 'Stage 4 of 6',
        progress: 66,
        updated: 'Yesterday at 4:15 PM',
        isActive: false,
        topLocality: 'Sector 43 / DLF Phase 5',
        commute: '22 min peak',
      },
      {
        id: 'plan_hyd',
        city: 'Hyderabad',
        cityKey: 'hyd',
        corridor: 'HITEC City & Financial District',
        origin: 'Lucknow, UP',
        annualLpa: 26,
        inHandSalary: 163000,
        monthlySurplus: 114000,
        status: 'Draft · Workplace Location',
        statusColor: 'text-[#C2410C] bg-[#FFEDD5]',
        stage: 'Stage 1 of 5',
        progress: 33,
        updated: '4 days ago',
        isActive: false,
        topLocality: 'Kondapur / Gachibowli',
        commute: '15 min peak',
      },
    ];
  });

  const handleResume = (plan: any) => {
    if (plan.stateSnapshot) {
      onUpdateState(plan.stateSnapshot);
    } else {
      onUpdateState({
        city: plan.cityKey || 'blr',
        from: plan.origin?.split(',')[0] || 'Lucknow',
        annualLpa: plan.annualLpa || 28,
        sal: plan.inHandSalary || 174500,
        flowPhase: 'recommendations',
        wpConfirmed: true,
      });
    }
    onNavigate(2); // Navigate to Dashboard
  };

  const handleDelete = (id: string) => {
    const next = savedPlans.filter((p) => p.id !== id);
    setSavedPlans(next);
    try {
      localStorage.setItem('ri_completed_reports', JSON.stringify(next));
    } catch (e) {}
  };

  const handleStartNew = () => {
    if (onStartNewPlan) {
      onStartNewPlan();
    }
    onNavigate(3); // Navigate to City Select
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Saved Plans"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={currentCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-7">
        <div>
          {/* Header & Primary CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                PORTFOLIO EVALUATIONS · MULTI-CITY PLANS
              </span>
              <h1 className="text-xl font-bold text-[#18231E]">
                Saved Relocation Evaluations ({savedPlans.length} Plans)
              </h1>
            </div>

            {/* Primary Action Buttons: Start New Plan & Resume Active Plan */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartNew}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start New Relocation Plan</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(2)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] animate-pulse" />
                <span>Resume Active Plan ({currentCityData.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-3">
            Compare multiple job offer relocation scenarios across different Indian metros without losing previous assumptions or calculations.
          </p>

          {/* Saved Plans Portfolio Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#176B50]/50 transition-all"
              >
                <div>
                  {/* Status & Timestamp Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-[#F0F2F4]">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        plan.statusColor || 'text-[#176B50] bg-[#E8F4EF]'
                      }`}
                    >
                      {plan.status || 'Active Plan'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan.id)}
                      className="text-[#A3B8AA] hover:text-[#DC2626] p-1 cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Plan Headline */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-[#18231E]">
                      {plan.origin} ➔ {plan.city}
                    </h3>
                    <p className="text-xs text-[#5F6A63] mt-0.5 truncate">
                      {plan.corridor || 'Target Workplace'}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9] text-xs">
                    <div>
                      <span className="text-[10px] text-[#5F6A63] block">Offered CTC</span>
                      <strong className="text-[#18231E]">₹{plan.annualLpa} LPA</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6A63] block">Net In-Hand</span>
                      <span className="font-mono text-[#18231E]">{formatINR(plan.inHandSalary)}/mo</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6A63] block">Monthly Surplus</span>
                      <strong className="text-[#176B50]">+{formatINR(plan.monthlySurplus)}/mo</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6A63] block">Day-1 Cash</span>
                      <span className="font-mono text-[#C2410C]">{formatINR(plan.day1Cash || 250000)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#F0F2F4] flex items-center justify-between">
                  <span className="text-[10px] text-[#5F6A63]">
                    {plan.updated || 'Saved Session'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleResume(plan)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Resume Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E5E9] mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate(2)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Executive Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs"
          >
            <span>Return to Landing Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
