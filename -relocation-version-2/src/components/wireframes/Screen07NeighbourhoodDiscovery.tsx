import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building,
  Check,
  Navigation,
  Clock,
  Layers,
  SlidersHorizontal,
  Star,
  CheckSquare,
  Square,
  Sparkles,
  Car,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { CITIES, PROPERTIES, formatINR } from '../../data/relocationData';
import { MapComponent } from '../MapComponent';
import { SortPriority } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const Screen07NeighbourhoodDiscovery: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  scoredNeighbourhoods,
  chosenNeighbourhood,
  onRouteLoaded,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  const currentWp = state.wp || { name: 'Outer Ring Road (EcoSpace)', lat: 12.926, lng: 77.683 };
  
  const [sortBy, setSortBy] = useState<SortPriority>('score');

  const sortedList = [...scoredNeighbourhoods].sort((a, b) => {
    if (sortBy === 'rent') return a.x.e.rent - b.x.e.rent;
    if (sortBy === 'commute') return (a.peakMin || a.x.min) - (b.peakMin || b.x.min);
    if (sortBy === 'savings') return b.monthlySurplus - a.monthlySurplus;
    return b.sc - a.sc; // default by worthwhile score
  });

  const cardsContainerRef = React.useRef<HTMLDivElement>(null);

  // Position chosenNeighbourhood at the very top of the stack so it slides up when picked on the map
  const activeLocality = sortedList.find((item) => item.i === chosenNeighbourhood.i);
  const otherLocalities = sortedList.filter((item) => item.i !== chosenNeighbourhood.i);
  const displayList = activeLocality ? [activeLocality, ...otherLocalities] : sortedList;

  // Auto-scroll list smoothly to top whenever chosenNeighbourhood changes
  React.useEffect(() => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chosenNeighbourhood.i]);

  const toggleShortlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const currentSel = state.sel || [];
    let nextSel: number[];
    if (currentSel.includes(id)) {
      nextSel = currentSel.filter((x) => x !== id);
    } else {
      nextSel = [id, ...currentSel].slice(0, 3);
    }
    onUpdateState({ sel: nextSel });
  };

  const handleSelectLocality = (id: number) => {
    const currentSel = state.sel || [];
    onUpdateState({
      sel: [id, ...currentSel.filter((x) => x !== id)].slice(0, 3),
    });
  };

  const badgeColorMap: Record<string, string> = {
    'BEST FIT': 'bg-[#E8F4EF] text-[#176B50] border border-[#176B50]/20',
    'BEST SAVINGS': 'bg-[#E8F4EF] text-[#176B50] border border-[#176B50]/20',
    'LOWEST RENT': 'bg-blue-50 text-blue-700 border border-blue-200',
    'SHORTEST COMMUTE': 'bg-blue-50 text-blue-700 border border-blue-200',
    'GOOD ALTERNATIVE': 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    'OVER BUDGET': 'bg-rose-50 text-[#BE123C] border border-rose-200',
    'LONG COMMUTE': 'bg-amber-50 text-amber-800 border border-amber-200',
  };

  const propLabel = PROPERTIES[state.prop]?.[0] || '2 BHK Society';

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
                CORRIDOR DISCOVERY & LOCALITY RANKING
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#18231E]">
                Discover neighbourhoods matching your {currentWp.name.split('·')[0]} commute
              </h1>
            </div>

            {/* Filter & Shortlist Action Strip */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortPriority)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#18231E] focus:outline-none focus:border-[#176B50] cursor-pointer"
              >
                <option value="score">Sort by: Worthwhile Score</option>
                <option value="commute">Sort by: Shortest Commute</option>
                <option value="rent">Sort by: Lowest Rent</option>
                <option value="savings">Sort by: Highest Savings</option>
              </select>

              <button
                type="button"
                onClick={() => onNavigate(8)}
                className="px-3.5 py-1.5 rounded-lg bg-[#18231E] hover:bg-[#176B50] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Compare Shortlist ({state.sel?.length || 0}/3)
              </button>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            Ranked residential corridors calculated using turn-by-turn road networks to your office campus, filtered by budget and peak commute duration.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(6)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Lifestyle Profile</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Active Locality:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {chosenNeighbourhood.a[0]}
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Fit: <strong className="text-[#176B50] font-mono">{chosenNeighbourhood.sc}/100</strong></span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Commute: <strong className="text-[#18231E] font-mono">~{chosenNeighbourhood.peakMin || 20}m</strong></span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate(8)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <span>Shortlist ({state.sel?.length || 0}/3)</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(9)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Proceed to Financial Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Split Screen Layout: Detailed Ranked Locality Cards vs Clean Interactive Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Comprehensive Locality Cards with full Corridor Match Rank and Active Road Route */}
            <div ref={cardsContainerRef} className="lg:col-span-6 space-y-4 max-h-[660px] overflow-y-auto pr-1 scroll-smooth">
              <AnimatePresence initial={false}>
                {displayList.map((area, index) => {
                  const isSelected = chosenNeighbourhood.i === area.i;
                  const inShortlist = state.sel?.includes(area.i);
                  const badgeColor =
                    badgeColorMap[area.badge] ||
                    'bg-neutral-100 text-neutral-700 border border-neutral-200';

                  const roadKmDisplay =
                    area.roadKm !== null && area.roadKm !== undefined
                      ? `${area.roadKm} km road`
                      : 'Modeled road';
                  const straightKmDisplay = `${area.straightLineKm} km straight-line`;
                  const peakMinDisplay =
                    area.peakMin !== null && area.peakMin !== undefined
                      ? `~${area.peakMin} min peak`
                      : `~${area.drivingMin} min`;
                  const baselineMinDisplay =
                    area.baselineMin !== null && area.baselineMin !== undefined
                      ? `~${area.baselineMin} min off-peak`
                      : '';

                  return (
                    <motion.div
                      key={area.i}
                      layout
                      initial={{ opacity: 0.9, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      onClick={() => handleSelectLocality(area.i)}
                      className={`p-4 sm:p-5 rounded-2xl border bg-white cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#176B50] ring-2 ring-[#176B50]/20 shadow-md'
                          : 'border-[#E2E5E9] hover:border-[#18231E]/40 shadow-xs'
                      }`}
                    >
                    {/* 1. Header with Corridor Match Rank, Locality Name, and Status Badge */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0F2F4]">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#176B50]">
                            CORRIDOR MATCH · RANK #{index + 1}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#176B50] text-white flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>SELECTED ON MAP</span>
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-base text-[#18231E] mt-1 truncate">
                          {area.a[0]}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                          {area.badge}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => toggleShortlist(e, area.i)}
                          className="p-1 rounded text-[#5F6A63] hover:text-[#176B50] hover:bg-[#F3F4F6] cursor-pointer"
                          title={inShortlist ? 'Remove from comparison' : 'Add to compare shortlist'}
                        >
                          {inShortlist ? (
                            <CheckSquare className="w-4 h-4 text-[#176B50]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#A3B8AA]" />
                          )}
                        </button>

                        <div className="text-right pl-2 border-l border-[#E2E5E9]">
                          <div className="text-base font-black text-[#176B50]">
                            {area.sc}<span className="text-[10px] text-[#5F6A63]">/100</span>
                          </div>
                          <span className="text-[9px] font-mono text-[#5F6A63] block">FIT SCORE</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Structured Cost & Commute Metrics */}
                    <div className="py-3 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#5F6A63] shrink-0">{propLabel} Rent:</span>
                        <span className="font-bold font-mono text-sm text-[#18231E] shrink-0">
                          {formatINR(area.x.e.rent)}<span className="text-[10px] font-normal text-[#5F6A63]">/mo</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#5F6A63] shrink-0">Upfront Deposit (Refundable):</span>
                        <span className="font-mono font-bold text-[#18231E] shrink-0">
                          {formatINR(area.depositRequired)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#5F6A63] shrink-0">Estimated Commute:</span>
                        <div className="text-right shrink-0">
                          <span className="font-bold font-mono text-sm text-[#176B50]">
                            {peakMinDisplay}
                          </span>
                          {baselineMinDisplay && (
                            <span className="block text-[10px] font-mono text-[#5F6A63]">
                              ({baselineMinDisplay})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#5F6A63] shrink-0">Road Network Distance:</span>
                        <div className="text-right font-mono shrink-0">
                          <span className="font-bold text-[#18231E]">{roadKmDisplay}</span>
                          <span className="text-[10px] text-[#5F6A63] block">({straightKmDisplay})</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Monthly Surplus Callout Banner */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-[#E8F4EF] border border-[#176B50]/20 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#176B50]">
                        Monthly Disposable Surplus:
                      </span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#176B50] shrink-0">
                        +{formatINR(area.monthlySurplus)}/mo
                      </span>
                    </div>

                    {/* 4. Active Road Route Corridor Section (Embedded inside the location card) */}
                    <div className="mt-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E5E9] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A63] flex items-center gap-1.5">
                          <Navigation className="w-3 h-3 text-[#176B50]" />
                          <span>Active Road Route</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase bg-white border border-[#E2E5E9] px-2 py-0.5 rounded text-[#176B50]">
                          OSRM Road Routing
                        </span>
                      </div>

                      <div className="font-semibold text-[#18231E] text-xs flex items-center gap-1.5 truncate">
                        <span className="truncate">{area.a[0]}</span>
                        <span className="text-[#8C9690] shrink-0">↔</span>
                        <span className="truncate text-[#5F6A63]">{currentWp.name}</span>
                      </div>

                      <div className="text-[10px] text-[#5F6A63] italic pt-1 border-t border-[#E2E5E9]/60 leading-tight">
                        *Peak commute calibrated for Indian tech corridors; live sensor feed disconnected.
                      </div>
                    </div>

                    {/* 5. Locality Vibe / Why Note */}
                    <p className="text-[11px] text-[#5F6A63] mt-2.5 line-clamp-2 leading-relaxed">
                      {area.whyExplanation || area.why}
                    </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right Column: Clean Interactive Map Canvas (ONLY location labels and route, NO popup cards or floating HUD banners) */}
            <div className="lg:col-span-6 bg-white border border-[#E2E5E9] rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E5E9] text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#176B50]" />
                  <span className="font-bold text-[#18231E]">
                    {currentCityData.name} Corridors Map
                  </span>
                  <span className="text-[10px] font-mono text-[#5F6A63]">
                    • Route & Locality Labels
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#5F6A63]">
                  <span>Office: <strong>{currentWp.name.split('·')[0]}</strong></span>
                </div>
              </div>

              {/* Real Interactive Map Component Container with hideBanners={true} */}
              <div className="w-full h-[580px] bg-[#EBF0EC] border border-[#E2E5E9] rounded-xl relative overflow-hidden">
                <MapComponent
                  city={state.city}
                  workplace={currentWp}
                  flowPhase="recommendations"
                  neighbourhoods={scoredNeighbourhoods}
                  selectedId={chosenNeighbourhood.i}
                  shortlist={state.sel}
                  propType={state.prop}
                  layers={{ n: true, w: true, c: true, r: true, t: true }}
                  currentStep={2}
                  onSelectNeighbourhood={handleSelectLocality}
                  onRouteLoaded={onRouteLoaded}
                  hideBanners={true}
                  className="h-full w-full"
                />
              </div>

              {/* Map Footer Metadata */}
              <div className="flex items-center justify-between text-[11px] text-[#5F6A63] px-1">
                <span>Selected: <strong className="text-[#18231E]">{chosenNeighbourhood.a[0]}</strong></span>
                <span className="font-mono">
                  Route: <strong className="text-[#176B50]">~{chosenNeighbourhood.peakMin || 20} mins</strong> ({chosenNeighbourhood.roadKm || chosenNeighbourhood.straightLineKm} km)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
