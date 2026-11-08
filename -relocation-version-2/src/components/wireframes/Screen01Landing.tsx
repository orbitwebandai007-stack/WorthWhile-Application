import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import {
  ArrowRight,
  MapPin,
  Navigation,
  CheckCircle,
  ShieldAlert,
  Clock,
  IndianRupee,
  Sparkles,
  Building2,
  TrendingUp,
  Check,
} from 'lucide-react';
import { CITIES, formatINR } from '../../data/relocationData';
import { lpaToMonthlyInHand } from '../OnboardingExperience';
import { CityKey } from '../../types';
import {
  ChamferCard,
  DotGlyph,
  TechWindow,
  DepositLockIsometric,
  CommuteVelocityIsometric,
  PurchasingPowerIsometric,
  HubBaselineIsometric,
  RoutingMatrixIsometric,
  ExecutiveReportIsometric,
  CompensationAuditIsometric,
} from '../TechCard';

export const Screen01Landing: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onStartNewPlan,
  onResumePlan,
  verdict,
}) => {
  const [fromCity, setFromCity] = useState(state.from || 'Lucknow');
  const [destCity, setDestCity] = useState<CityKey>(state.city || 'blr');
  const [annualLpa, setAnnualLpa] = useState<number>(state.annualLpa || 28);
  const [selectedCityTab, setSelectedCityTab] = useState<'blr' | 'ncr'>('blr');

  const destCityData = CITIES[destCity] || CITIES.blr;
  const inHandMonthly = lpaToMonthlyInHand(annualLpa);

  const handleStartMove = () => {
    const chosenCityData = CITIES[destCity] || CITIES.blr;
    const defaultHub = chosenCityData.hubs[0];
    onUpdateState({
      from: fromCity.trim() || 'Lucknow',
      city: destCity,
      wp: {
        name: defaultHub[0],
        lat: defaultHub[1],
        lng: defaultHub[2],
      },
      annualLpa: annualLpa,
      sal: inHandMonthly,
      flowPhase: 'workplace_select',
      journeyStartedAt: Date.now(),
    });
    onNavigate(4); // Navigate directly to Workplace Location Selection (Screen 4)
  };

  // Interactive showcase areas for Bengaluru & Delhi NCR (Matching user's attached section screenshot)
  const showcaseAreas = {
    blr: [
      {
        name: 'Indiranagar',
        hub: 'MG Road (12 min)',
        rent1BHK: '₹28,000',
        rent2BHK: '₹44,000',
        vibe: 'Walkable, tree-lined, social hubs, 100ft Rd cafes & metro access',
        commuteScore: 92,
      },
      {
        name: 'HSR Layout',
        hub: 'ORR & Bellandur (18 min)',
        rent1BHK: '₹22,000',
        rent2BHK: '₹36,000',
        vibe: 'Startup corridor, peaceful sectors, parks & quick ORR campus transit',
        commuteScore: 95,
      },
      {
        name: 'Whitefield',
        hub: 'ITPL & Outer Ring Road (15 min)',
        rent1BHK: '₹16,000',
        rent2BHK: '₹28,000',
        vibe: 'Gated high-rises, international schools & purple line metro connectivity',
        commuteScore: 88,
      },
      {
        name: 'Bellandur',
        hub: 'EcoSpace & RMZ Ecoworld (10 min)',
        rent1BHK: '₹20,000',
        rent2BHK: '₹34,000',
        vibe: 'Immediate proximity to major tech campuses on the tech ring road',
        commuteScore: 90,
      },
    ],
    ncr: [
      {
        name: 'Cyber City · Gurugram',
        hub: 'DLF CyberHub & Udyog Vihar (8 min)',
        rent1BHK: '₹26,000',
        rent2BHK: '₹42,000',
        vibe: 'Rapid Metro, corporate headquarters, luxury towers & nightlife',
        commuteScore: 94,
      },
      {
        name: 'Golf Course Road · Gurugram',
        hub: 'Cyber City (14 min)',
        rent1BHK: '₹32,000',
        rent2BHK: '₹55,000',
        vibe: 'Ultra-prime residential, wide boulevards & premium club amenities',
        commuteScore: 91,
      },
      {
        name: 'Sector 62 · Noida',
        hub: 'Noida IT Hub & Sector 18 (12 min)',
        rent1BHK: '₹14,000',
        rent2BHK: '₹24,000',
        vibe: 'Organized sectors, blue line metro & affordable gated towers',
        commuteScore: 89,
      },
      {
        name: 'Saket · South Delhi',
        hub: 'Connaught Place & Aerocity (22 min)',
        rent1BHK: '₹24,000',
        rent2BHK: '₹38,000',
        vibe: 'Green enclaves, Yellow Line metro, heritage & premier malls',
        commuteScore: 87,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Overview"
        onNavigate={onNavigate}
        fromCity={state.from}
        destCityName={destCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Hero Viewport Section: Vertically & Horizontally Centered with ChamferCard Tech Styling */}
      <section className="min-h-[calc(100vh-4.25rem)] w-full flex flex-col justify-center items-center py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
        <ChamferCard
          notchSize={28}
          className="w-full max-w-7xl shadow-xs hover:shadow-md transition-shadow"
          innerClassName="p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full w-full"
        >
          {/* Technical Spec Header (matching other sections on home page) */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5EAE5]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#176B50] animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                WORTHWHILE SPEC: RELOCATION INTELLIGENCE // 06 METRO HUBS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#5F6A63] uppercase hidden sm:block">
                SYS_VER 3.4 // LIVE MODEL
              </span>
              <DotGlyph type="reticle" className="w-4 h-4 text-[#18231E]" />
            </div>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#176B50]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
                <span>DECISION INTELLIGENCE FOR TECH RELOCATIONS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight uppercase leading-[1.12] text-[#18231E]">
                FOCUS ON YOUR CAREER, WE'LL HANDLE YOUR CITY MOVE.
              </h1>

              <p className="text-sm text-[#5F6A63] leading-relaxed max-w-xl">
                Evaluate whether moving to another Indian city for a job is financially and practically worthwhile.
                Calculate real in-hand cash, uncover hidden 10-month rental deposit locks, model peak commute corridors,
                and discover your true monthly savings before signing the offer.
              </p>

              {/* Action Buttons: Start Relocation Plan & Resume Plan */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartMove}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Start Relocation Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E2E5E9] bg-white text-xs font-semibold text-[#18231E] hover:bg-[#F3F4F6] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
                  <span>Open Active Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(12)}
                  className="px-4 py-3 rounded-xl text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F3F4F6] cursor-pointer"
                >
                  Saved Plans Portfolio
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E2E5E9] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="block font-bold text-sm text-[#18231E]">6 Metros</span>
                  <span className="text-[#5F6A63] text-[11px]">BLR, NCR, HYD, MUM, PUN, CHN</span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-[#176B50]">100% Deterministic</span>
                  <span className="text-[#5F6A63] text-[11px]">No simulated AI guesses</span>
                </div>
                <div>
                  <span className="block font-bold text-sm text-[#18231E]">OSRM Traffic</span>
                  <span className="text-[#5F6A63] text-[11px]">Road distance & peak hours</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Quick Setup Terminal */}
            <div className="lg:col-span-5 bg-[#F8F9FA] border border-[#E5EAE5] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#18231E]">
                  <Sparkles className="w-4 h-4 text-[#176B50]" />
                  <span>INITIALIZE CAREER MOVE</span>
                </div>
                <span className="text-[10px] font-mono text-[#176B50] bg-[#E8F4EF] px-2 py-0.5 rounded font-semibold">
                  STAGE 01 / 05
                </span>
              </div>

              {/* Form Input 1: Origin City */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-[#5F6A63] tracking-wider">
                  Current City of Residence
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#5F6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Lucknow, Pune, Kolkata"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E5E9] rounded-lg text-xs font-semibold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                  />
                </div>
              </div>

              {/* Form Input 2: Destination City */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-[#5F6A63] tracking-wider">
                  Target Destination City
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#5F6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value as CityKey)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E5E9] rounded-lg text-xs font-semibold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                  >
                    <option value="blr">Bengaluru (Karnataka)</option>
                    <option value="ncr">Delhi NCR (Gurugram / Noida)</option>
                    <option value="hyd">Hyderabad (Telangana)</option>
                    <option value="mum">Mumbai (Maharashtra)</option>
                    <option value="pun">Pune (Maharashtra)</option>
                    <option value="che">Chennai (Tamil Nadu)</option>
                  </select>
                </div>
                <span className="text-[10px] text-[#5F6A63] block">
                  Deposit norm in {destCityData.name}: <strong>{destCityData.depositMonthsRange[0]}–{destCityData.depositMonthsRange[1]} months</strong>
                </span>
              </div>

              {/* Form Input 3: Expected Annual CTC */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold uppercase text-[#5F6A63] tracking-wider">Offered Annual CTC</span>
                  <span className="font-mono font-bold text-[#176B50]">₹{annualLpa} LPA</span>
                </div>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-[#5F6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={3}
                    max={150}
                    value={annualLpa}
                    onChange={(e) => setAnnualLpa(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-12 py-2 bg-white border border-[#E2E5E9] rounded-lg text-xs font-bold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5F6A63]">
                    LPA
                  </span>
                </div>
                {/* Real In-Hand calculation pill */}
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E5E9] flex justify-between items-center text-xs">
                  <span className="text-[#5F6A63]">Estimated Monthly In-Hand:</span>
                  <strong className="text-[#176B50] font-mono text-sm">
                    {formatINR(inHandMonthly)}/mo
                  </strong>
                </div>
              </div>

              {/* Launch CTA */}
              <button
                type="button"
                onClick={handleStartMove}
                className="w-full py-2.5 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Launch Analysis Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ChamferCard>
      </section>

      {/* Main Remaining Sections Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-10 flex flex-col space-y-16 sm:space-y-24">

        {/* SECTION 1: THE TRAP // THE SALARY ILLUSION */}
        <section id="problem" className="border-t border-[#E2E5E9] pt-12 sm:pt-16">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#176B50] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
              <span>THE TRAP // THE SALARY ILLUSION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18231E]">
              Why a 30% CTC hike can leave you with less cash in hand.
            </h2>
            <p className="mt-3 text-sm text-[#5F6A63] leading-relaxed">
              Most job switchers evaluate offers on annual CTC. But moving between cities introduces hidden capital locks and non-linear cost multipliers that raw numbers obscure.
            </p>
          </div>

          {/* 3 Architectural Chamfered Spec Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Deposit Lock */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  THE 10-MONTH DEPOSIT LOCK
                </span>
                <DotGlyph type="stepped" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Bengaluru landlords frequently mandate 6 to 10 months of rent upfront as an interest-free deposit. Locking ₹3,00,000–₹4,50,000 upfront in dead capital wipes out months of initial hike cashflow.
                </p>
              </div>

              <TechWindow>
                <DepositLockIsometric />
              </TechWindow>
            </ChamferCard>

            {/* Card 2: Commute Velocity */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  COMMUTE VELOCITY & SURGE
                </span>
                <DotGlyph type="arrow" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Living 12 km from Cyber City Gurugram or Outer Ring Road Bengaluru isn't a 20-minute drive. Peak hours easily double fuel, cab surge, and wear overhead to ₹12,000+/mo.
                </p>
              </div>

              <TechWindow>
                <CommuteVelocityIsometric />
              </TechWindow>
            </ChamferCard>

            {/* Card 3: Purchasing Power */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  PURCHASING POWER VARIANCE
                </span>
                <DotGlyph type="square" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Groceries, domestic help, weekend dining, and society maintenance charges vary by up to 35% between Noida, Gurugram, Central Bengaluru, and Whitefield.
                </p>
              </div>

              <TechWindow>
                <PurchasingPowerIsometric />
              </TechWindow>
            </ChamferCard>
          </div>
        </section>

        {/* SECTION 2: THE ENGINE // ALGORITHMIC PRECISION */}
        <section id="how-it-works" className="border-t border-[#E2E5E9] pt-12 sm:pt-16">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#176B50] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
              <span>THE ENGINE // ALGORITHMIC PRECISION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18231E]">
              Algorithmic precision across 6 structured steps.
            </h2>
            <p className="mt-3 text-sm text-[#5F6A63] leading-relaxed">
              We replace vague forum opinions and broker estimates with reproducible road network measurements, calibrated lifestyle indices, and validated neighbourhood rent bands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Engine Card 1 */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  01. HUB & TAKE-HOME BASELINE
                </span>
                <DotGlyph type="reticle" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Pin your employer's exact tech campus or business hub. Enter your monthly in-hand cashflow and non-negotiable debt commitments to establish your true baseline.
                </p>
              </div>

              <TechWindow>
                <HubBaselineIsometric />
              </TechWindow>
            </ChamferCard>

            {/* Engine Card 2 */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  02. OSRM ROAD MATRIX & SCORING
                </span>
                <DotGlyph type="cross" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Our routing engine calculates turn-by-turn road distance and driving duration from every residential area to your desk, weighting affordability, commute, and savings.
                </p>
              </div>

              <TechWindow>
                <RoutingMatrixIsometric />
              </TechWindow>
            </ChamferCard>

            {/* Engine Card 3 */}
            <ChamferCard notchSize={20}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  03. SCENARIOS & EXECUTIVE BRIEF
                </span>
                <DotGlyph type="grid" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 flex-1">
                <p className="text-xs text-[#5F6A63] leading-relaxed">
                  Simulate lifestyle trade-offs (cooking vs dining out, 1 BHK vs 2 BHK) and export a clean relocation brief with counter-offer requirements.
                </p>
              </div>

              <TechWindow>
                <ExecutiveReportIsometric />
              </TechWindow>
            </ChamferCard>
          </div>
        </section>

        {/* SECTION 3: LOCALITY INTELLIGENCE (Matches Screenshot with Bengaluru / NCR Corridors) */}
        <section id="neighbourhoods" className="border-t border-[#E2E5E9] pt-12 sm:pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#176B50] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
                <span>LOCALITY INTELLIGENCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18231E]">
                Benchmark neighbourhoods before you sign a lease.
              </h2>
              <p className="mt-2 text-sm text-[#5F6A63]">
                Curated rental bands, commute scores, and lifestyle attributes across target corridors.
              </p>
            </div>

            {/* City Segmented Switcher */}
            <div className="inline-flex w-full sm:w-auto p-1 bg-white rounded-xl border border-[#E2E5E9] shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedCityTab('blr')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
                  selectedCityTab === 'blr'
                    ? 'bg-[#176B50] text-white shadow-xs'
                    : 'text-[#5F6A63] hover:text-[#18231E]'
                }`}
              >
                Bengaluru Corridors
              </button>
              <button
                type="button"
                onClick={() => setSelectedCityTab('ncr')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
                  selectedCityTab === 'ncr'
                    ? 'bg-[#176B50] text-white shadow-xs'
                    : 'text-[#5F6A63] hover:text-[#18231E]'
                }`}
              >
                Delhi NCR Corridors
              </button>
            </div>
          </div>

          {/* Locality Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {showcaseAreas[selectedCityTab].map((area) => (
              <ChamferCard key={area.name} notchSize={18}>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase truncate">
                    {area.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8F4EF] text-[#176B50] font-bold shrink-0">
                    Score {area.commuteScore}
                  </span>
                </div>

                <div className="py-3 flex-1 space-y-2">
                  <span className="text-[11px] font-mono text-[#5F6A63] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#176B50] shrink-0" />
                    <span className="truncate">{area.hub}</span>
                  </span>
                  <p className="text-xs text-[#5F6A63] leading-relaxed line-clamp-2">
                    {area.vibe}
                  </p>
                </div>

                {/* Technical rent spec window */}
                <div className="border border-[#E5EAE5] bg-[#FBFDFB] p-2.5 space-y-1.5 font-mono text-xs mt-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#5F6A63]">1 BHK:</span>
                    <span className="font-bold text-[#18231E]">{area.rent1BHK}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#5F6A63]">2 BHK:</span>
                    <span className="font-bold text-[#176B50]">{area.rent2BHK}</span>
                  </div>
                </div>
              </ChamferCard>
            ))}
          </div>
        </section>

        {/* SECTION 4: CITY REALITIES // COST & COMMUTE DYNAMICS */}
        <section id="cities" className="border-t border-[#E2E5E9] pt-12 sm:pt-16">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#176B50] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
              <span>CITY REALITIES // COST & COMMUTE DYNAMICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18231E]">
              Bengaluru vs. Delhi NCR: The Relocation Equation
            </h2>
            <p className="mt-3 text-sm text-[#5F6A63] leading-relaxed">
              Both hubs represent India’s economic engines, but their living costs and infrastructure dynamics require fundamentally different planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bengaluru Card */}
            <ChamferCard notchSize={24}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  BENGALURU // KARNATAKA TECH CAPITAL
                </span>
                <DotGlyph type="stepped" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 space-y-3 flex-1 text-xs text-[#5F6A63]">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">High Upfront Capital:</strong> Expect 8–10 months deposit in Indiranagar/Koramangala, 4–6 months in Whitefield.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">Commute Bottlenecks:</strong> Silk Board, Marathahalli & Hebbal traffic corridors penalize living &gt;10 km from office.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">Pleasant Climate:</strong> Substantially lower air conditioning electricity bills across 9 months of the year.</span>
                </div>
              </div>

              <div className="border border-[#E5EAE5] bg-[#FBFDFB] p-2.5 sm:p-3 grid grid-cols-3 gap-1 sm:gap-2 font-mono text-center text-xs mt-2 rounded">
                <div className="border-r border-[#E5EAE5] pr-1 sm:pr-2">
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">Avg 2BHK</div>
                  <div className="font-bold text-[#18231E] text-xs mt-0.5 truncate">₹32,000</div>
                </div>
                <div className="border-r border-[#E5EAE5] pr-1 sm:pr-2">
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">Deposit</div>
                  <div className="font-bold text-[#176B50] text-xs mt-0.5 truncate">8–10 Mo.</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">AC Power</div>
                  <div className="font-bold text-[#18231E] text-xs mt-0.5 truncate">Low (~₹1.5k)</div>
                </div>
              </div>
            </ChamferCard>

            {/* Delhi NCR Card */}
            <ChamferCard notchSize={24}>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                  DELHI NCR // NATIONAL CAPITAL REGION
                </span>
                <DotGlyph type="arrow" className="w-4 h-4 text-[#18231E]" />
              </div>

              <div className="py-4 space-y-3 flex-1 text-xs text-[#5F6A63]">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">Flexible Rental Deposits:</strong> Typically 2 months rent deposit in Gurugram, Noida, and South Delhi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">Rapid Arterial Transit:</strong> Delhi Metro Yellow/Blue lines and 16-lane expressways allow longer transit radii.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B50] mt-1.5 shrink-0" />
                  <span><strong className="text-[#18231E]">Seasonal Utilities:</strong> Extreme summers require high air conditioning power consumption (₹4,500–₹8,000/mo).</span>
                </div>
              </div>

              <div className="border border-[#E5EAE5] bg-[#FBFDFB] p-2.5 sm:p-3 grid grid-cols-3 gap-1 sm:gap-2 font-mono text-center text-xs mt-2 rounded">
                <div className="border-r border-[#E5EAE5] pr-1 sm:pr-2">
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">Avg 2BHK</div>
                  <div className="font-bold text-[#18231E] text-xs mt-0.5 truncate">₹28,000</div>
                </div>
                <div className="border-r border-[#E5EAE5] pr-1 sm:pr-2">
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">Deposit</div>
                  <div className="font-bold text-[#176B50] text-xs mt-0.5 truncate">2 Mo.</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5F6A63] uppercase truncate">AC Power</div>
                  <div className="font-bold text-[#18231E] text-xs mt-0.5 truncate">High (~₹6.5k)</div>
                </div>
              </div>
            </ChamferCard>
          </div>
        </section>

        {/* SECTION 5: NEGOTIATION INTELLIGENCE // OFFER PARITY AUDIT */}
        <section id="evaluation" className="border-t border-[#E2E5E9] pt-12 sm:pt-16 pb-12">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#176B50] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#176B50]" />
              <span>NEGOTIATION INTELLIGENCE // OFFER PARITY AUDIT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18231E]">
              Evaluating an offer? Calculate your counter-offer baseline.
            </h2>
            <p className="mt-3 text-sm text-[#5F6A63] leading-relaxed">
              A relocation offer is only worth taking if your <strong>net bankable surplus</strong> exceeds your current lifestyle savings. Use our parity formula to confirm whether the relocation bonus and in-hand package justify the move.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Parity Vector & Compensation Audit */}
            <div className="lg:col-span-7">
              <ChamferCard notchSize={24}>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                    COMPENSATION AUDIT & DISPOSABLE SURPLUS
                  </span>
                  <DotGlyph type="reticle" className="w-4 h-4 text-[#18231E]" />
                </div>

                <div className="py-4 flex-1">
                  <p className="text-xs text-[#5F6A63] leading-relaxed">
                    Moving between Bengaluru and Delhi NCR introduces non-linear rent inflators, upfront deposit locks, and commute overhead. Our model isolates fixed liabilities to establish the exact post-tax in-hand hike required to maintain or grow your savings rate.
                  </p>
                </div>

                <TechWindow>
                  <CompensationAuditIsometric />
                </TechWindow>
              </ChamferCard>
            </div>

            {/* Counter-Offer Benchmarks */}
            <div className="lg:col-span-5">
              <ChamferCard notchSize={24}>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE5]">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#18231E] uppercase">
                    COUNTER-OFFER BENCHMARKS
                  </span>
                  <DotGlyph type="stepped" className="w-4 h-4 text-[#18231E]" />
                </div>

                <div className="py-4 space-y-2.5 flex-1">
                  <div className="p-3 bg-[#FBFDFB] border border-[#E5EAE5] rounded flex items-center justify-between font-mono text-xs">
                    <span className="text-[#5F6A63]">Min. In-Hand Hike</span>
                    <span className="font-bold text-[#18231E]">+25% to +35%</span>
                  </div>
                  <div className="p-3 bg-[#FBFDFB] border border-[#E5EAE5] rounded flex items-center justify-between font-mono text-xs">
                    <span className="text-[#5F6A63]">Rental Deposit Lock</span>
                    <span className="font-bold text-[#18231E]">₹2.5L – ₹4.0L</span>
                  </div>
                  <div className="p-3 bg-[#FBFDFB] border border-[#E5EAE5] rounded flex items-center justify-between font-mono text-xs">
                    <span className="text-[#5F6A63]">Settling Reserve</span>
                    <span className="font-bold text-[#18231E]">₹50k – ₹80k</span>
                  </div>
                  <div className="p-3 bg-[#FBFDFB] border border-[#E5EAE5] rounded flex items-center justify-between font-mono text-xs">
                    <span className="text-[#5F6A63]">Parity Multiplier</span>
                    <span className="font-bold text-[#176B50]">1.28x Base Cost</span>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="border border-[#E5EAE5] bg-[#FBFDFB] p-3.5 space-y-2 mt-2 rounded">
                  <button
                    type="button"
                    onClick={handleStartMove}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#176B50] hover:bg-[#125740] shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Run Compensation Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[10px] font-mono text-[#5F6A63] text-center">
                    CALIBRATED FOR BLR & DELHI NCR
                  </div>
                </div>
              </ChamferCard>
            </div>
          </div>
        </section>

        {/* Brand Footer */}
        <div className="pt-8 border-t border-[#E2E5E9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6A63]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#176B50]" />
            <strong className="text-[#18231E]">Worthwhile</strong>
            <span>· Relocation Intelligence for Indian Tech Professionals</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Deterministic Math</span>
            <span>•</span>
            <span>OSRM Road Matrices</span>
            <span>•</span>
            <span>Verified Rentals</span>
          </div>
        </div>
      </div>
    </div>
  );
};
