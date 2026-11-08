import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sliders,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Info,
  Check,
  IndianRupee,
} from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';
import { CityKey } from '../../types';

export const Screen02Dashboard: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  scoredNeighbourhoods,
  chosenNeighbourhood,
  movingCosts,
  verdict,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  const currentWp = state.wp || { name: 'Outer Ring Road (EcoSpace Bellandur)', lat: 12.926, lng: 77.683 };
  
  // Real calculations
  const monthlyInHand = state.sal || 174500;
  const monthlyExpenses = chosenNeighbourhood.x.tot;
  const monthlySurplus = Math.max(0, monthlyInHand - monthlyExpenses - state.com);
  const savingsRate = Math.round((monthlySurplus / monthlyInHand) * 100);
  const surplusDelta = verdict.savingsDeltaMonthly;

  const steps = [
    { num: 1, name: 'Workplace', screen: 4, val: currentWp.name.split('·')[0].trim(), done: true },
    { num: 2, name: 'Compensation', screen: 5, val: `₹${state.annualLpa || 28} LPA`, done: true },
    { num: 3, name: 'Housing & Life', screen: 6, val: state.prop.toUpperCase(), done: true },
    { num: 4, name: 'Corridors', screen: 7, val: chosenNeighbourhood.a[0], done: true },
    { num: 5, name: 'Waterfall', screen: 9, val: `+${formatINR(monthlySurplus)}/mo`, done: true },
    { num: 6, name: 'Blueprint', screen: 11, val: verdict.badgeLabel, done: true },
    { num: 7, name: 'Executive Dashboard', screen: 2, val: 'Overall Synthesis', done: true, isCurrent: true },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Dashboard"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={currentCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Dashboard Canvas */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 md:p-10 space-y-7">
        {/* Top Active Evaluation Banner */}
        <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4EF] border border-[#176B50]/20 flex items-center justify-center text-[#176B50] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[#176B50] text-white px-2 py-0.5 rounded font-bold">
                  ACTIVE EVALUATION #{state.city.toUpperCase()}-2026
                </span>
                <span className="text-xs text-[#5F6A63]">Live Decision Workspace</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#18231E] mt-1">
                Relocation Plan: {state.from} ➔ {currentCityData.name} ({currentWp.name.split('·')[0]})
              </h1>
              <p className="text-xs text-[#5F6A63]">
                Target Office: {currentWp.name} • Offer CTC: ₹{state.annualLpa || 28}.0 LPA • New Tax Regime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate(11)}
              className="px-4 py-2 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              Review Blueprint
            </button>
            <button
              type="button"
              onClick={() => onNavigate(12)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer"
            >
              <span>Saved Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Navigation Bar in Clear View below Step & Subheading */}
        <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate(11)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Relocation Blueprint</span>
          </button>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#5F6A63] hidden sm:inline">Overall Verdict:</span>
            <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
              {verdict.badgeLabel}
            </span>
            <span className="text-[#8C9690] hidden sm:inline">•</span>
            <span className="text-[#5F6A63] hidden sm:inline">Net Monthly Surplus:</span>
            <span className="font-bold text-[#176B50] font-mono text-xs">+{formatINR(monthlySurplus)}/mo ({savingsRate}%)</span>
            <span className="text-[#8C9690] hidden sm:inline">•</span>
            <span className="text-[#5F6A63] hidden sm:inline">Payback:</span>
            <span className="font-bold text-[#18231E] font-mono text-xs">{verdict.economicPaybackMonths || 3.2} Mo</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(12)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Saved Plans Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Core Financial KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-[#5F6A63]">
              <span>Monthly In-Hand Cash</span>
              <span className="text-[10px] font-mono bg-[#F3F4F6] px-1.5 py-0.5 rounded">NEW TAX REGIME</span>
            </div>
            <div className="text-2xl font-black text-[#18231E] mt-2">
              {formatINR(monthlyInHand)}<span className="text-xs font-normal text-[#5F6A63]">/mo</span>
            </div>
            <div className="text-xs text-[#176B50] font-medium mt-1">
              +{formatINR(Math.max(0, monthlyInHand - state.currentSal))}/mo over {state.from} base
            </div>
          </div>

          <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-[#5F6A63]">
              <span>Est. Monthly Outflow</span>
              <span className="text-[10px] font-mono bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                {chosenNeighbourhood.a[0].toUpperCase()}
              </span>
            </div>
            <div className="text-2xl font-black text-[#18231E] mt-2">
              {formatINR(monthlyExpenses)}<span className="text-xs font-normal text-[#5F6A63]">/mo</span>
            </div>
            <div className="text-xs text-[#5F6A63] font-medium mt-1">
              Rent {formatINR(chosenNeighbourhood.x.e.rent)} • Living {formatINR(monthlyExpenses - chosenNeighbourhood.x.e.rent)}
            </div>
          </div>

          <div className="bg-white border border-[#176B50]/30 bg-[#F4F9F6] rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-[#176B50]">
              <span className="font-semibold">Projected Monthly Surplus</span>
              <span className="text-[10px] font-mono bg-[#176B50] text-white px-1.5 py-0.5 rounded font-bold">
                {savingsRate}% SAVINGS
              </span>
            </div>
            <div className="text-2xl font-black text-[#176B50] mt-2">
              +{formatINR(monthlySurplus)}<span className="text-xs font-normal text-[#176B50]/80">/mo</span>
            </div>
            <div className="text-xs text-[#176B50] font-medium mt-1">
              {surplusDelta > 0 ? `+${formatINR(surplusDelta)}/mo net incremental gain` : 'Balanced savings delta'}
            </div>
          </div>

          <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-[#5F6A63]">
              <span>Relocation Payback</span>
              <span className="text-[10px] font-mono bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                SUNK COST RECOVERY
              </span>
            </div>
            <div className="text-2xl font-black text-[#18231E] mt-2">
              {verdict.economicPaybackMonths ? `${verdict.economicPaybackMonths} Months` : 'N/A'}
            </div>
            <div className="text-xs text-[#5F6A63] font-medium mt-1">
              Day-1 Cash: {formatINR(movingCosts.totalDay1CashRequired)} (Deposit locked: {formatINR(movingCosts.totalRecoverableCapital)})
            </div>
          </div>
        </div>

        {/* 7-Stage Relocation Journey Tracker */}
        <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                Relocation Evaluation Pipeline
              </span>
              <span className="text-[10px] font-mono text-[#5F6A63]">• 7 structured stages</span>
            </div>
            <span className="text-xs font-mono text-[#176B50] font-bold">STAGE 07 / 07 · EXECUTIVE SYNTHESIS COMPLETE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
            {steps.map((st) => (
              <div
                key={st.num}
                onClick={() => onNavigate(st.screen)}
                className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                  st.isCurrent
                    ? 'border-[#176B50] bg-[#E8F4EF]/60 shadow-xs ring-1 ring-[#176B50]/30'
                    : 'border-[#E2E5E9] hover:border-[#176B50] bg-[#F8F9FA] hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-[#5F6A63]">
                  <span>0{st.num}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#176B50]" />
                </div>
                <div className={`text-xs font-bold mt-1 ${st.isCurrent ? 'text-[#176B50]' : 'text-[#18231E] group-hover:text-[#176B50]'}`}>
                  {st.name}
                </div>
                <div className="text-[11px] text-[#5F6A63] truncate mt-0.5">
                  {st.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Top Scored Corridor Highlight vs Decision Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Chosen Locality Highlight Card */}
          <div className="lg:col-span-7 bg-white border border-[#E2E5E9] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#176B50] bg-[#E8F4EF] px-2 py-0.5 rounded uppercase">
                  {chosenNeighbourhood.badge}
                </span>
                <h3 className="text-lg font-bold text-[#18231E] mt-1.5">
                  {chosenNeighbourhood.a[0]} · Recommended Living Hub
                </h3>
                <p className="text-xs text-[#5F6A63] mt-0.5">
                  {chosenNeighbourhood.whyExplanation || chosenNeighbourhood.why}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-[#176B50]">
                  {chosenNeighbourhood.sc}<span className="text-xs text-[#5F6A63]">/100</span>
                </div>
                <span className="text-[10px] font-mono text-[#5F6A63]">WORTHWHILE FIT SCORE</span>
              </div>
            </div>

            {/* Commute and Financial Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E5E9] text-xs">
              <div>
                <span className="text-[10px] text-[#5F6A63] block">Monthly Rent</span>
                <strong className="text-[#18231E]">{formatINR(chosenNeighbourhood.x.e.rent)}/mo</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6A63] block">Deposit Lock</span>
                <strong className="text-[#C2410C]">{formatINR(chosenNeighbourhood.depositRequired)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6A63] block">Peak Commute</span>
                <strong className="text-[#176B50]">~{chosenNeighbourhood.peakMin || 20} min</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6A63] block">Road Distance</span>
                <span className="text-[#18231E] font-medium">{chosenNeighbourhood.roadKm || chosenNeighbourhood.straightLineKm} km</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(7)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Explore Interactive Map & All Corridors</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(8)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <span>Compare Shortlist (3)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(9)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <span>Financial Waterfall</span>
              </button>
            </div>
          </div>

          {/* Right Column: Relocation Verdict & Key Insights */}
          <div className="lg:col-span-5 bg-white border border-[#E2E5E9] rounded-xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#18231E]">
                  <ShieldCheck className="w-4 h-4 text-[#176B50]" />
                  <span>DECISION VERDICT</span>
                </div>
                <span className="text-[10px] font-mono text-[#176B50] bg-[#E8F4EF] px-2 py-0.5 rounded font-bold">
                  {verdict.badgeLabel}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#18231E] mt-3">
                {verdict.headline}
              </h4>
              <p className="text-xs text-[#5F6A63] mt-1.5 leading-relaxed">
                {verdict.rationale}
              </p>

              {/* 4 Decision Pillars */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <span className="text-[10px] text-[#5F6A63] block">Monthly Surplus</span>
                  <strong className="text-[#176B50]">{verdict.pillars.surplus.metric}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <span className="text-[10px] text-[#5F6A63] block">Savings Rate</span>
                  <strong className="text-[#18231E]">{verdict.pillars.savingsRate.metric}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <span className="text-[10px] text-[#5F6A63] block">Upfront Liquidity</span>
                  <strong className="text-[#C2410C]">{verdict.pillars.liquidity.metric}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E5E9]">
                  <span className="text-[10px] text-[#5F6A63] block">Daily Commute</span>
                  <strong className="text-[#18231E]">{verdict.pillars.commute.metric}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(11)}
              className="w-full py-2.5 rounded-lg bg-[#176B50] hover:bg-[#125740] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Full Relocation Blueprint Dossier</span>
            </button>
          </div>
        </div>

        {/* SECTION: DESTINATION RENTAL ECONOMICS & METRO BENCHMARKS */}
        <div className="bg-white border border-[#E2E5E9] rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#176B50]">
                <Building2 className="w-4 h-4 text-[#176B50]" />
                <span>DESTINATION RENTAL ECONOMICS & METRO BENCHMARKS</span>
              </div>
              <h2 className="text-lg font-bold text-[#18231E] mt-1">
                Real Rental Yields, Deposit Norms & Living Overhead in {currentCityData.name}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6A63]">Selected Destination:</span>
              <span className="px-3 py-1 bg-[#E8F4EF] text-[#176B50] font-bold rounded-lg font-mono">
                {currentCityData.name} ({currentCityData.stateName})
              </span>
            </div>
          </div>

          {/* 4 Architectural Metric Cards for Selected City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Upfront Security Deposit Custom */}
            <div className="p-4 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5F6A63]">
                <span className="font-bold uppercase text-[10px]">Security Deposit Custom</span>
                <span className="text-[10px] font-mono text-[#C2410C] font-bold">UPFRONT CAPITAL LOCK</span>
              </div>
              <div className="text-xl font-black text-[#18231E]">
                {currentCityData.depositMonthsRange[0]} – {currentCityData.depositMonthsRange[1]} Months
              </div>
              <p className="text-[11px] text-[#5F6A63] leading-relaxed">
                Landlords in {currentCityData.name} require <strong>{currentCityData.defaultDepositMonths} months rent</strong> as an interest-free refundable deposit, locking ~<strong>{formatINR(chosenNeighbourhood.x.e.rent * currentCityData.defaultDepositMonths)}</strong> in upfront dead liquidity.
              </p>
            </div>

            {/* Metric 2: Median Rental Spectrum */}
            <div className="p-4 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5F6A63]">
                <span className="font-bold uppercase text-[10px]">Rental Price Bands</span>
                <span className="text-[10px] font-mono text-[#176B50] font-bold">GATED COMMUNITIES</span>
              </div>
              <div className="text-xl font-black text-[#18231E]">
                {currentCityData.name === 'Bengaluru' ? '₹28k – ₹42k' : currentCityData.name === 'Delhi NCR' ? '₹30k – ₹48k' : '₹24k – ₹36k'}<span className="text-xs font-normal text-[#5F6A63]"> / 2BHK</span>
              </div>
              <p className="text-[11px] text-[#5F6A63] leading-relaxed">
                1 BHK independent units average <strong>{currentCityData.name === 'Bengaluru' ? '₹18,000–₹24,000' : '₹16,000–₹26,000'}</strong>, while 2 BHK society apartments with backup & parking run <strong>{currentCityData.name === 'Bengaluru' ? '₹32,000' : '₹34,000'}</strong>.
              </p>
            </div>

            {/* Metric 3: Commute & Traffic Congestion */}
            <div className="p-4 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5F6A63]">
                <span className="font-bold uppercase text-[10px]">Traffic & Transit Friction</span>
                <span className="text-[10px] font-mono text-[#18231E] font-bold">PEAK CHOKE POINTS</span>
              </div>
              <div className="text-xl font-black text-[#18231E]">
                {currentCityData.name === 'Bengaluru' ? '42 min / 10km' : currentCityData.name === 'Delhi NCR' ? '28 min / 10km' : '30 min / 10km'}
              </div>
              <p className="text-[11px] text-[#5F6A63] leading-relaxed">
                {currentCityData.name === 'Bengaluru'
                  ? 'Severe bottlenecks at Silk Board, Marathahalli, and Hebbal penalize residing >8 km away from your tech campus.'
                  : currentCityData.name === 'Delhi NCR'
                  ? 'Expressway networks & Rapid Metro permit 15–20 km transit radii, though Cyber City & IFFCO Chowk see peak delays.'
                  : 'Radial transit corridors and ring roads allow moderate travel durations.'}
              </p>
            </div>

            {/* Metric 4: Seasonal Climate & Power Bills */}
            <div className="p-4 rounded-xl border border-[#E2E5E9] bg-[#F8F9FA] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5F6A63]">
                <span className="font-bold uppercase text-[10px]">Climate & Power Burn</span>
                <span className="text-[10px] font-mono text-[#176B50] font-bold">SEASONAL VARIANCE</span>
              </div>
              <div className="text-xl font-black text-[#18231E]">
                {currentCityData.name === 'Bengaluru' ? '~₹1,500/mo' : currentCityData.name === 'Delhi NCR' ? '~₹6,500/mo' : '~₹3,000/mo'}
              </div>
              <p className="text-[11px] text-[#5F6A63] leading-relaxed">
                {currentCityData.name === 'Bengaluru'
                  ? 'Temperate plateau climate requires negligible air conditioning across 9 months, saving ₹4,000–₹6,000/mo in electricity.'
                  : currentCityData.name === 'Delhi NCR'
                  ? 'Extreme peak summer temperatures (45°C+) require 24/7 air conditioning, pushing monthly power bills to ₹6,000–₹9,000.'
                  : 'Moderate seasonal cooling demand with steady electricity rates.'}
              </p>
            </div>
          </div>

          {/* Comprehensive Comparative Matrix across all 6 Indian Tech Metros */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                National Tech Metro Comparison Matrix
              </span>
              <span className="text-[11px] text-[#5F6A63]">
                Click any city to switch destination
              </span>
            </div>

            <div className="border border-[#E2E5E9] rounded-xl overflow-x-auto bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#E2E5E9] font-bold text-[#18231E]">
                    <th className="p-3.5 pl-4">Metro City</th>
                    <th className="p-3.5">Security Deposit Custom</th>
                    <th className="p-3.5">1 BHK Rent</th>
                    <th className="p-3.5">2 BHK Rent</th>
                    <th className="p-3.5">Traffic Congestion Index</th>
                    <th className="p-3.5">Seasonal AC Power</th>
                    <th className="p-3.5 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2F4]">
                  {[
                    {
                      key: 'blr',
                      name: 'Bengaluru',
                      state: 'Karnataka',
                      depositNorm: '6 – 10 months upfront',
                      rent1BHK: '₹18,000 – ₹24,000',
                      rent2BHK: '₹28,000 – ₹42,000',
                      traffic: 'Severe (42 min / 10 km)',
                      acPower: 'Low (~₹1.5k/mo)',
                    },
                    {
                      key: 'ncr',
                      name: 'Delhi NCR',
                      state: 'Gurugram & Noida',
                      depositNorm: '2 – 3 months upfront',
                      rent1BHK: '₹18,000 – ₹26,000',
                      rent2BHK: '₹30,000 – ₹48,000',
                      traffic: 'Rapid Metro & 16-Lane Expressways',
                      acPower: 'High (~₹6.5k/mo)',
                    },
                    {
                      key: 'hyd',
                      name: 'Hyderabad',
                      state: 'Telangana',
                      depositNorm: '2 – 3 months upfront',
                      rent1BHK: '₹15,000 – ₹20,000',
                      rent2BHK: '₹24,000 – ₹34,000',
                      traffic: 'Moderate (28 min / 10 km)',
                      acPower: 'Moderate-High (~₹3.5k)',
                    },
                    {
                      key: 'mum',
                      name: 'Mumbai',
                      state: 'Maharashtra',
                      depositNorm: '3 – 6 months upfront',
                      rent1BHK: '₹28,000 – ₹42,000',
                      rent2BHK: '₹48,000 – ₹75,000',
                      traffic: 'High Local Train & Metro Density',
                      acPower: 'Moderate-High (~₹4k)',
                    },
                    {
                      key: 'pun',
                      name: 'Pune',
                      state: 'Maharashtra',
                      depositNorm: '2 – 3 months upfront',
                      rent1BHK: '₹14,000 – ₹18,000',
                      rent2BHK: '₹22,000 – ₹30,000',
                      traffic: 'Moderate (Hinjawadi bottleneck)',
                      acPower: 'Low-Moderate (~₹2k)',
                    },
                    {
                      key: 'che',
                      name: 'Chennai',
                      state: 'Tamil Nadu',
                      depositNorm: '4 – 6 months upfront',
                      rent1BHK: '₹13,000 – ₹17,000',
                      rent2BHK: '₹20,000 – ₹28,000',
                      traffic: 'Stable Radial Transit (OMR / MRTS)',
                      acPower: 'High (~₹4.5k/mo)',
                    },
                  ].map((city) => {
                    const isCurrent = state.city === city.key;

                    return (
                      <tr
                        key={city.key}
                        className={`hover:bg-[#F8F9FA] transition-colors ${
                          isCurrent ? 'bg-[#E8F4EF]/40 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <div className="font-bold text-[#18231E] flex items-center gap-1.5">
                            <span>{city.name}</span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#5F6A63]">{city.state}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`font-mono text-xs ${city.key === 'blr' ? 'text-[#C2410C] font-bold' : 'text-[#18231E]'}`}>
                            {city.depositNorm}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[#18231E]">{city.rent1BHK}</td>
                        <td className="p-3.5 font-mono text-[#176B50] font-bold">{city.rent2BHK}</td>
                        <td className="p-3.5 text-[#5F6A63] text-xs">{city.traffic}</td>
                        <td className="p-3.5 text-xs text-[#5F6A63]">{city.acPower}</td>
                        <td className="p-3.5 pr-4 text-right">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#176B50] bg-[#E8F4EF] px-2.5 py-1 rounded-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const newCityData = CITIES[city.key as CityKey] || CITIES.blr;
                                const defaultHub = newCityData.hubs[0];
                                onUpdateState({
                                  city: city.key as CityKey,
                                  wp: {
                                    name: defaultHub[0],
                                    lat: defaultHub[1],
                                    lng: defaultHub[2],
                                  },
                                  sel: [],
                                });
                              }}
                              className="px-2.5 py-1 rounded-md border border-[#E2E5E9] hover:border-[#176B50] hover:text-[#176B50] text-[#5F6A63] text-xs font-medium cursor-pointer transition-colors"
                            >
                              Select City
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
