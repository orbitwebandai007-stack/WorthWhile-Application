import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers,
  Layout,
  ExternalLink,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

import { Screen01Landing } from './Screen01Landing';
import { Screen02Dashboard } from './Screen02Dashboard';
import { Screen03CitySelect } from './Screen03CitySelect';
import { Screen04WorkplaceSelect } from './Screen04WorkplaceSelect';
import { Screen05SalaryInputs } from './Screen05SalaryInputs';
import { Screen06LifestylePreferences } from './Screen06LifestylePreferences';
import { Screen07NeighbourhoodDiscovery } from './Screen07NeighbourhoodDiscovery';
import { Screen08AffordabilityCompare } from './Screen08AffordabilityCompare';
import { Screen09FinancialAnalysis } from './Screen09FinancialAnalysis';
import { Screen10WhatIfScenarios } from './Screen10WhatIfScenarios';
import { Screen11BlueprintReport } from './Screen11BlueprintReport';
import { Screen12SavedPlans } from './Screen12SavedPlans';
import { WireframeScreenProps } from './wireframeTypes';

interface WireframeGalleryProps extends WireframeScreenProps {
  onSwitchToLiveApp?: () => void;
  activeScreenIndex?: number;
  onScreenChange?: (screenIndex: number) => void;
}

export const WireframeGallery: React.FC<WireframeGalleryProps> = (props) => {
  const {
    onSwitchToLiveApp,
    activeScreenIndex = 1,
    onScreenChange,
    onNavigate,
  } = props;

  const [currentScreen, setCurrentScreen] = useState(activeScreenIndex);
  const [zoomMode, setZoomMode] = useState<'fit' | 'actual'>('fit');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);

  useEffect(() => {
    setCurrentScreen(activeScreenIndex);
  }, [activeScreenIndex]);

  const handleNavigate = (idx: number) => {
    setCurrentScreen(idx);
    onScreenChange?.(idx);
    onNavigate?.(idx);
  };

  const screens = [
    { id: 1, title: 'Landing Page & Value Proposition', subtitle: 'Public introduction, CTC trap, and entry route selector', slug: 'landing_page' },
    { id: 2, title: 'Main Relocation Dashboard', subtitle: 'Active plan overview, 4 core KPIs, and 6-stage tracker', slug: 'relocation_dashboard' },
    { id: 3, title: 'Destination City Selection', subtitle: '6-metro comparative matrix with deposit standards', slug: 'destination_city_selection' },
    { id: 4, title: 'Workplace Location Selection', subtitle: 'Office location, transit nodes & commute geometry', slug: 'workplace_location_selection' },
    { id: 5, title: 'Compensation & Commitments', subtitle: 'CTC to post-tax take-home, EMI debt & savings targets', slug: 'salary_commitments_savings' },
    { id: 6, title: 'Lifestyle & Housing Parameters', subtitle: 'Housing tier, commute modes & discretionary tier', slug: 'lifestyle_accommodation_preferences' },
    { id: 7, title: 'Neighbourhood Discovery & Map', subtitle: 'Ranked locality cards, isochrones & OSRM routing', slug: 'neighbourhood_discovery_map' },
    { id: 8, title: 'Locality Affordability Comparison', subtitle: 'Side-by-side trade-offs comparison matrix', slug: 'affordability_comparison_matrix' },
    { id: 9, title: 'Monthly Financial Analysis', subtitle: 'Cashflow waterfall, itemized living costs & savings delta', slug: 'monthly_financial_analysis' },
    { id: 10, title: 'What-If Scenario Modeling', subtitle: 'Hybrid frequency, rent escalation & flat sharing stress test', slug: 'what_if_scenario_modeling' },
    { id: 11, title: 'Comprehensive Relocation Blueprint', subtitle: 'Executive decision verdict, capital schedule & 3-yr wealth', slug: 'relocation_blueprint_report' },
    { id: 12, title: 'Saved Multi-City Evaluations', subtitle: 'Saved plans portfolio, start new plan & resume draft', slug: 'saved_relocation_plans' },
  ];

  // Auto-calculate scale for 'fit' mode
  useEffect(() => {
    const updateScale = () => {
      if (zoomMode === 'actual') {
        setScale(1);
        return;
      }
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 48; // padding
      const availableHeight = containerRef.current.clientHeight - 48;
      const scaleX = availableWidth / 1440;
      const scaleY = availableHeight / 1000;
      const calculatedScale = Math.min(scaleX, scaleY, 1);
      setScale(Math.max(calculatedScale, 0.4));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomMode, currentScreen]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentScreen < 12) {
        handleNavigate(currentScreen + 1);
      } else if (e.key === 'ArrowLeft' && currentScreen > 1) {
        handleNavigate(currentScreen - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  // Export current screen as High-Resolution 2x PNG (2880 x 2000 px)
  const handleExportPng = async () => {
    if (!canvasRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const activeScreenInfo = screens[currentScreen - 1];
      const dataUrl = await toPng(canvasRef.current, {
        pixelRatio: 2, // Crisp retina 2x resolution
        cacheBust: true,
        style: {
          transform: 'none', // Capture at native unscaled resolution
        },
      });

      const link = document.createElement('a');
      link.download = `worthwhile_screen_${String(currentScreen).padStart(2, '0')}_${activeScreenInfo.slug}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(`Screen ${currentScreen} exported at 2880×2000px`);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to export PNG', err);
      alert('Could not export PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentScreenData = screens[currentScreen - 1];

  const screenProps: WireframeScreenProps = {
    ...props,
    onNavigate: handleNavigate,
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
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

  return (
    <div className="w-full h-screen bg-[#1E2320] flex flex-col overflow-hidden select-none">
      {/* Top Studio Control Bar */}
      <header className="w-full h-14 bg-[#141815] border-b border-[#2C332E] px-6 flex items-center justify-between text-white z-30 shrink-0">
        {/* Left: Brand & Gallery Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#176B50] flex items-center justify-center text-white font-bold text-xs">
              W
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Worthwhile</span>
            <span className="text-[10px] font-mono uppercase bg-[#2C332E] text-[#A3B8AA] px-2 py-0.5 rounded font-semibold">
              12-SCREEN WIREFRAME SUITE
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#2C332E]" />

          {/* Screen Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#A3B8AA]">Screen:</span>
            <select
              value={currentScreen}
              onChange={(e) => handleNavigate(Number(e.target.value))}
              className="bg-[#1E2320] border border-[#2C332E] rounded-md px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-[#176B50] cursor-pointer"
            >
              {screens.map((s) => (
                <option key={s.id} value={s.id}>
                  {String(s.id).padStart(2, '0')}. {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Previous / Next Quick Stepper */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentScreen === 1}
            onClick={() => handleNavigate(Math.max(1, currentScreen - 1))}
            className="p-1.5 rounded bg-[#1E2320] border border-[#2C332E] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2C332E] cursor-pointer"
            title="Previous Screen (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono px-2 text-[#A3B8AA]">
            <strong className="text-white">{String(currentScreen).padStart(2, '0')}</strong> / 12
          </span>

          <button
            type="button"
            disabled={currentScreen === 12}
            onClick={() => handleNavigate(Math.min(12, currentScreen + 1))}
            className="p-1.5 rounded bg-[#1E2320] border border-[#2C332E] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2C332E] cursor-pointer"
            title="Next Screen (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom Mode, Export PNG & Live App Switcher */}
        <div className="flex items-center gap-3">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setZoomMode(zoomMode === 'fit' ? 'actual' : 'fit')}
            className="px-2.5 py-1 rounded bg-[#1E2320] border border-[#2C332E] text-xs text-[#A3B8AA] hover:text-white flex items-center gap-1.5 cursor-pointer"
            title="Toggle View Mode"
          >
            {zoomMode === 'fit' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Fit ({Math.round(scale * 100)}%)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>100% (1440×1000)</span>
              </>
            )}
          </button>

          {/* High-Resolution PNG Export Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportPng}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#176B50] hover:bg-[#125740] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            title="Export high-resolution PNG (2880×2000 @ 2x)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting 2x PNG...' : 'Export Screen PNG'}</span>
          </button>

          {/* Live Full-Width Interactive Switcher */}
          {onSwitchToLiveApp && (
            <button
              type="button"
              onClick={onSwitchToLiveApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C332E] hover:bg-[#373F3A] text-white text-xs font-medium border border-[#3E4741] transition-colors cursor-pointer"
            >
              <span>Full-Width App View</span>
              <ExternalLink className="w-3 h-3 text-[#A3B8AA]" />
            </button>
          )}
        </div>
      </header>

      {/* Export Success Toast */}
      {exportSuccess && (
        <div className="absolute top-16 right-6 z-50 bg-[#176B50] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Main Viewport Workspace */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-auto flex items-center justify-center p-6 relative bg-[#1E2320]"
      >
        <div
          style={{
            transform: zoomMode === 'fit' ? `scale(${scale})` : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shadow-2xl rounded-xl overflow-hidden border border-[#2C332E] shrink-0"
        >
          {/* The Exact 1440 × 1000 Canvas Element Exported */}
          <div ref={canvasRef} id="wireframe-canvas" className="w-[1440px] h-[1000px] bg-white overflow-hidden">
            {renderActiveScreen()}
          </div>
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      <footer className="w-full h-16 bg-[#141815] border-t border-[#2C332E] px-4 flex items-center justify-center gap-2 overflow-x-auto shrink-0 z-30">
        {screens.map((screen) => {
          const isActive = currentScreen === screen.id;
          return (
            <button
              key={screen.id}
              type="button"
              onClick={() => handleNavigate(screen.id)}
              className={`h-11 px-3 rounded-lg flex items-center gap-2 border text-left transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#176B50] border-[#176B50] text-white font-bold shadow-xs'
                  : 'bg-[#1E2320] border-[#2C332E] text-[#A3B8AA] hover:text-white hover:bg-[#2C332E]'
              }`}
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                isActive ? 'bg-white text-[#176B50]' : 'bg-[#2C332E] text-[#A3B8AA]'
              }`}>
                {String(screen.id).padStart(2, '0')}
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] leading-tight truncate max-w-[110px]">
                  {screen.title.split('&')[0].split('(')[0]}
                </span>
                <span className={`text-[9px] font-mono leading-none ${isActive ? 'text-white/80' : 'text-[#5F6A63]'}`}>
                  Screen {screen.id}
                </span>
              </div>
            </button>
          );
        })}
      </footer>
    </div>
  );
};
