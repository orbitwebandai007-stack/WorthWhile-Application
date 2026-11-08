import React, { useState, useEffect, useMemo } from 'react';
import { CityKey, MapLayersState, RelocationState, ScoredNeighbourhood, WorkplaceHub } from './types';
import {
  CITIES,
  INITIAL_STATE,
  createFreshJourney,
  calculateNeighbourhoods,
  getChosenNeighbourhood,
  calculateMovingCosts,
  evaluateRelocationVerdict,
} from './data/relocationData';
import { RouteInfo, getDrivingRoute } from './services/routingService';

// Wireframe Screen Suite
import { Screen01Landing } from './components/wireframes/Screen01Landing';
import { Screen02Dashboard } from './components/wireframes/Screen02Dashboard';
import { Screen03CitySelect } from './components/wireframes/Screen03CitySelect';
import { Screen04WorkplaceSelect } from './components/wireframes/Screen04WorkplaceSelect';
import { Screen05SalaryInputs } from './components/wireframes/Screen05SalaryInputs';
import { Screen06LifestylePreferences } from './components/wireframes/Screen06LifestylePreferences';
import { Screen07NeighbourhoodDiscovery } from './components/wireframes/Screen07NeighbourhoodDiscovery';
import { Screen08AffordabilityCompare } from './components/wireframes/Screen08AffordabilityCompare';
import { Screen09FinancialAnalysis } from './components/wireframes/Screen09FinancialAnalysis';
import { Screen10WhatIfScenarios } from './components/wireframes/Screen10WhatIfScenarios';
import { Screen11BlueprintReport } from './components/wireframes/Screen11BlueprintReport';
import { Screen12SavedPlans } from './components/wireframes/Screen12SavedPlans';
import { WireframeGallery } from './components/wireframes/WireframeGallery';
import { WireframeScreenProps } from './components/wireframes/wireframeTypes';

// Legacy Views & Components for Fallback
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { MapComponent } from './components/MapComponent';
import { PlannerPanel } from './components/PlannerPanel';
import { OnboardingExperience } from './components/OnboardingExperience';

import {
  Compass,
  Edit3,
  Layers,
  Layout,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export default function App() {
  // Application view mode: 'app' (live responsive 12-screen wireframe flow), 'studio' (1440x1000 PNG exporter), or 'legacy' (original view)
  const [appMode, setAppMode] = useState<'app' | 'studio' | 'legacy'>('app');
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  const [state, setState] = useState<RelocationState>(() => {
    try {
      const stored = localStorage.getItem('ri_active_journey') || localStorage.getItem('ri_v2');
      if (stored) {
        return { ...INITIAL_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage error on init', e);
    }
    return INITIAL_STATE;
  });

  // Candidate workplace for Phase 2 selection before user confirmation
  const [candidateWp, setCandidateWp] = useState<WorkplaceHub | null>(null);

  // In-memory route dictionary for OSRM driving routes
  const [routeMap, setRouteMap] = useState<Map<string, RouteInfo>>(new Map());

  // Save state to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem('ri_active_journey', JSON.stringify(state));
      localStorage.setItem('ri_v2', JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [state]);

  const updateState = (updates: Partial<RelocationState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Safely archive an existing completed or in-progress plan to prevent unintended data loss
  const archiveCompletedReport = (prevJourney: RelocationState) => {
    try {
      if (
        prevJourney.wpConfirmed ||
        prevJourney.st > 0 ||
        (prevJourney.sel && prevJourney.sel.length > 0) ||
        prevJourney.journeyStartedAt
      ) {
        const existingReportsStr = localStorage.getItem('ri_completed_reports');
        const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : [];
        const cityData = CITIES[prevJourney.city] || CITIES.blr;
        const reportArchive = {
          id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          archivedAt: new Date().toISOString(),
          origin: prevJourney.from,
          city: cityData.name,
          cityKey: prevJourney.city,
          workplace: prevJourney.wp?.name || 'Unspecified',
          annualLpa: prevJourney.annualLpa,
          inHandSalary: prevJourney.sal,
          finalStep: prevJourney.st,
          isCompleted: prevJourney.isCompleted || prevJourney.st === 5,
          stateSnapshot: prevJourney,
        };
        localStorage.setItem(
          'ri_completed_reports',
          JSON.stringify([reportArchive, ...existingReports.slice(0, 9)])
        );
      }
    } catch (e) {
      console.warn('Failed to archive historical relocation report', e);
    }
  };

  // 1. Start Relocation Plan: Always initiate a completely fresh relocation journey
  const handleStartNewPlan = () => {
    archiveCompletedReport(state);
    const fresh = createFreshJourney();
    setCandidateWp(null);
    setRouteMap(new Map());
    setState(fresh);
    setActiveScreen(4); // Navigate directly to Stage 01 (Workplace Selection)
  };

  // 2. Resume Plan: Resume the user's most recent active relocation journey
  const handleResumePlan = () => {
    setActiveScreen(2); // Jump directly to Main Relocation Dashboard
  };

  const handleReset = () => {
    if (confirm('Reset your relocation plan to initial defaults?')) {
      const resetState: RelocationState = {
        ...INITIAL_STATE,
        v: 'land',
        journeyStartedAt: undefined,
        isCompleted: false,
      };
      setState(resetState);
      setCandidateWp(null);
      setRouteMap(new Map());
      setActiveScreen(1);
      try {
        localStorage.removeItem('ri_active_journey');
        localStorage.removeItem('ri_v2');
      } catch (e) {}
    }
  };

  const handleRouteLoaded = (areaName: string, route: RouteInfo) => {
    setRouteMap((prev) => {
      const next = new Map(prev);
      next.set(areaName, route);
      return next;
    });
  };

  // Prefetch OSRM driving routes when workplace is available
  useEffect(() => {
    const currentWp = state.wp;
    if (!currentWp) return;
    const cityData = CITIES[state.city] || CITIES.blr;
    const areas = cityData.areas;
    let isCancelled = false;

    const prefetch = async () => {
      for (const area of areas) {
        if (isCancelled) break;
        if (!routeMap.has(area[0])) {
          try {
            const route = await getDrivingRoute(
              currentWp.lng,
              currentWp.lat,
              area[2],
              area[1]
            );
            if (!isCancelled) {
              setRouteMap((prev) => new Map(prev).set(area[0], route));
            }
            await new Promise((r) => setTimeout(r, 220));
          } catch (e) {}
        }
      }
    };

    prefetch();

    return () => {
      isCancelled = true;
    };
  }, [state.wp?.lat, state.wp?.lng, state.city]);

  // Live scored neighbourhoods calculation
  const scoredNeighbourhoods = useMemo(() => {
    return calculateNeighbourhoods(state.city, state.wp, state, routeMap);
  }, [
    state.city,
    state.wp,
    state.sal,
    state.tgt,
    state.tm,
    state.com,
    state.prop,
    state.food,
    state.tr,
    state.life,
    state.maxc,
    state.f,
    state.weights,
    routeMap,
  ]);

  const chosenNeighbourhood = useMemo(() => {
    return getChosenNeighbourhood(state, scoredNeighbourhoods);
  }, [state.sel, scoredNeighbourhoods]);

  // Transparent moving cost breakdown
  const movingCosts = useMemo(() => {
    return calculateMovingCosts(
      state.from,
      state.city,
      chosenNeighbourhood.x.e.rent,
      state.prop,
      state
    );
  }, [state.from, state.city, chosenNeighbourhood.x.e.rent, state.prop, state]);

  // Intelligent Relocation Verdict
  const verdict = useMemo(() => {
    return evaluateRelocationVerdict(state.city, chosenNeighbourhood, state, movingCosts);
  }, [state.city, chosenNeighbourhood, state, movingCosts]);

  // Standard Wireframe Screen Props passed to each screen
  const screenProps: WireframeScreenProps = {
    state,
    onUpdateState: updateState,
    onNavigate: (scr) => {
      setActiveScreen(scr);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scoredNeighbourhoods,
    chosenNeighbourhood,
    movingCosts,
    verdict,
    routeMap,
    onRouteLoaded: handleRouteLoaded,
    candidateWp,
    onSelectCandidateWp: (wp) => setCandidateWp(wp),
    onStartNewPlan: handleStartNewPlan,
    onResumePlan: handleResumePlan,
  };

  const screensInfo = [
    { id: 1, title: 'Landing' },
    { id: 2, title: 'Dashboard' },
    { id: 3, title: 'City Select' },
    { id: 4, title: 'Workplace' },
    { id: 5, title: 'Salary' },
    { id: 6, title: 'Lifestyle' },
    { id: 7, title: 'Corridors' },
    { id: 8, title: 'Compare' },
    { id: 9, title: 'Waterfall' },
    { id: 10, title: 'What-If' },
    { id: 11, title: 'Blueprint' },
    { id: 12, title: 'Saved Plans' },
  ];

  // Render the active screen in production full-width app mode
  const renderActiveAppScreen = () => {
    switch (activeScreen) {
      case 1:
        return <Screen01Landing {...screenProps} />;
      case 2:
        return <Screen02Dashboard {...screenProps} />;
      case 3:
        return <Screen03CitySelect {...screenProps} />;
      case 4:
        return <Screen04WorkplaceSelect {...screenProps} />;
      case 5:
        return <Screen05SalaryInputs {...screenProps} />;
      case 6:
        return <Screen06LifestylePreferences {...screenProps} />;
      case 7:
        return <Screen07NeighbourhoodDiscovery {...screenProps} />;
      case 8:
        return <Screen08AffordabilityCompare {...screenProps} />;
      case 9:
        return <Screen09FinancialAnalysis {...screenProps} />;
      case 10:
        return <Screen10WhatIfScenarios {...screenProps} />;
      case 11:
        return <Screen11BlueprintReport {...screenProps} />;
      case 12:
        return <Screen12SavedPlans {...screenProps} />;
      default:
        return <Screen01Landing {...screenProps} />;
    }
  };

  // 1. Studio Mode (1440×1000 Canvas with 2x PNG Exporter)
  if (appMode === 'studio') {
    return (
      <WireframeGallery
        {...screenProps}
        activeScreenIndex={activeScreen}
        onScreenChange={(idx) => setActiveScreen(idx)}
        onSwitchToLiveApp={() => setAppMode('app')}
      />
    );
  }

  // 2. Legacy Map & Split Panel Interface
  if (appMode === 'legacy') {
    const isLanding = state.v === 'land';
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9F7] text-[#18231E]">
        <Header
          fromCity={state.from}
          city={state.city}
          workplace={state.wp}
          currentStep={state.st}
          maxStep={state.max}
          isLanding={isLanding}
          hasUnfinishedPlan={Boolean(state.wpConfirmed || state.st > 0)}
          onGoLanding={() => updateState({ v: 'land' })}
          onGoStep={(step) => updateState({ v: 'step', st: step })}
          onStartNewPlan={handleStartNewPlan}
          onResumePlan={handleResumePlan}
          onSelectCity={(cityKey) => updateState({ city: cityKey })}
          onReset={handleReset}
          onOpenWireframes={() => setAppMode('app')}
        />

        {isLanding ? (
          <main className="flex-1 w-full mx-auto">
            <LandingPage
              state={state}
              hasUnfinishedPlan={Boolean(state.wpConfirmed || state.st > 0)}
              onStartNewPlan={handleStartNewPlan}
              onResumePlan={handleResumePlan}
              onStartPlanning={handleStartNewPlan}
              onResumePlanning={handleResumePlan}
            />
            <Footer onStartNewPlan={handleStartNewPlan} onReset={handleReset} />
          </main>
        ) : (
          <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
            <MapComponent
              city={state.city}
              workplace={state.wp}
              candidateWp={candidateWp}
              flowPhase={state.flowPhase || 'recommendations'}
              neighbourhoods={scoredNeighbourhoods}
              selectedId={chosenNeighbourhood.i}
              shortlist={state.sel}
              propType={state.prop}
              layers={{ n: true, w: true, c: true, r: true, t: true }}
              currentStep={state.st}
              onSelectNeighbourhood={(id) => {
                updateState({
                  sel: [id, ...state.sel.filter((x) => x !== id)].slice(0, 3),
                });
              }}
              onRouteLoaded={handleRouteLoaded}
              className="h-full w-full"
            />
          </div>
        )}

        <div className="fixed bottom-4 left-4 z-50">
          <button
            type="button"
            onClick={() => setAppMode('app')}
            className="px-4 py-2 rounded-lg bg-[#18231E] text-white text-xs font-semibold shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <Layout className="w-4 h-4 text-[#C8E6A0]" />
            <span>Switch to 12 Wireframes Experience</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Primary Production Mode: Live Experimental Redesign with all 12 Connected Wireframe Screens
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col relative">
      {/* Active Wireframe Screen Content */}
      <main className="flex-1 w-full">
        {renderActiveAppScreen()}
      </main>
    </div>
  );
}
