import React, { useState, useRef, useEffect } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { Search, MapPin, Building, ArrowRight, ArrowLeft, Check, Navigation, AlertTriangle, Compass } from 'lucide-react';
import { CITIES } from '../../data/relocationData';
import { WorkplaceHub } from '../../types';
import { MapComponent } from '../MapComponent';

export const Screen04WorkplaceSelect: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  candidateWp,
  onSelectCandidateWp,
  onStartNewPlan,
}) => {
  const currentCityData = CITIES[state.city] || CITIES.blr;
  
  // Dynamic list of known tech hubs for this city
  const cityHubs = currentCityData.hubs.map((hub, idx) => ({
    id: `hub_${idx}`,
    name: hub[0],
    subtext: `${hub[0]}, ${currentCityData.name}`,
    lat: hub[1],
    lng: hub[2],
  }));

  const initialWp = state.wp || {
    name: currentCityData.hubs[0][0],
    lat: currentCityData.hubs[0][1],
    lng: currentCityData.hubs[0][2],
  };

  const [selectedHubName, setSelectedHubName] = useState<string>(initialWp.name);
  const [searchQuery, setSearchQuery] = useState('');

  // Card element refs for auto-scrolling when selected on the map
  const hubCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredHubs = cityHubs.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeHub = cityHubs.find((h) => h.name === selectedHubName) || cityHubs[0] || {
    name: initialWp.name,
    lat: initialWp.lat,
    lng: initialWp.lng,
    subtext: currentCityData.name,
  };

  // Two-way interaction: clicking an office on the map or in the list updates both
  const handleSelectHub = (hub: { name: string; lat: number; lng: number }) => {
    setSelectedHubName(hub.name);
    const wpObj: WorkplaceHub = {
      name: hub.name,
      lat: hub.lat,
      lng: hub.lng,
    };
    if (onSelectCandidateWp) {
      onSelectCandidateWp(wpObj);
    }
  };

  // When selectedHubName changes (especially from map clicks), smoothly scroll the corresponding card into view
  useEffect(() => {
    if (selectedHubName && hubCardRefs.current[selectedHubName]) {
      hubCardRefs.current[selectedHubName]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedHubName]);

  const handleConfirmWorkplace = () => {
    const finalWp: WorkplaceHub = {
      name: activeHub.name,
      lat: activeHub.lat,
      lng: activeHub.lng,
    };

    onUpdateState({
      wp: finalWp,
      wpConfirmed: true,
      flowPhase: 'recommendations',
      st: 2,
    });

    onNavigate(5); // Proceed to Screen 05 (Salary & Commitments)
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Office Location"
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
                WORKPLACE LOCATION SELECTION
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#18231E]">
                Where will your office be located in {currentCityData.name}?
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6A63]">Destination Metro:</span>
              <select
                value={state.city}
                onChange={(e) => {
                  const newCityKey = e.target.value as any;
                  const newCityData = CITIES[newCityKey] || CITIES.blr;
                  const defaultHub = newCityData.hubs[0];
                  const wpObj = {
                    name: defaultHub[0],
                    lat: defaultHub[1],
                    lng: defaultHub[2],
                  };
                  setSelectedHubName(defaultHub[0]);
                  if (onSelectCandidateWp) {
                    onSelectCandidateWp(wpObj);
                  }
                  onUpdateState({
                    city: newCityKey,
                    wp: wpObj,
                    sel: [],
                  });
                }}
                className="px-3 py-1.5 bg-white border border-[#E2E5E9] rounded-lg font-bold text-[#18231E] text-xs focus:outline-none focus:border-[#176B50] cursor-pointer"
              >
                <option value="blr">Bengaluru (Karnataka)</option>
                <option value="ncr">Delhi NCR (Gurugram / Noida)</option>
                <option value="hyd">Hyderabad (Telangana)</option>
                <option value="mum">Mumbai (Maharashtra)</option>
                <option value="pun">Pune (Maharashtra)</option>
                <option value="che">Chennai (Tamil Nadu)</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-3 leading-relaxed">
            Your office location determines all daily commute travel durations, peak traffic bottlenecks, and feasible residential corridors. Select a major tech hub or click anywhere on the map to place your campus.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Overview</span>
            </button>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Active Office:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {activeHub.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirmWorkplace}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Confirm Workplace & Set Compensation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2-Column Split: Office Hub List vs Interactive Map with Office Pinpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Tech Parks & Address Search */}
            <div className="lg:col-span-6 bg-white border border-[#E2E5E9] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#5F6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search office parks or tech campuses in ${currentCityData.name}...`}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] rounded-xl text-xs font-semibold text-[#18231E] focus:outline-none focus:border-[#176B50]"
                />
              </div>

              {/* Hub Cards List with responsive card focus */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scroll-smooth">
                {filteredHubs.map((hub) => {
                  const isSelected = selectedHubName === hub.name;

                  return (
                    <div
                      key={hub.id}
                      ref={(el) => {
                        hubCardRefs.current[hub.name] = el;
                      }}
                      onClick={() => handleSelectHub(hub)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#176B50] bg-[#E8F4EF]/60 shadow-md ring-2 ring-[#176B50]/20'
                          : 'border-[#E2E5E9] bg-white hover:border-[#18231E]/40 hover:bg-[#FBFDFB]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                              isSelected ? 'bg-[#176B50] text-white shadow-xs' : 'bg-[#F3F4F6] text-[#5F6A63]'
                            }`}
                          >
                            <Building className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-[#18231E] truncate">{hub.name}</h3>
                            <p className="text-[11px] text-[#5F6A63] mt-0.5 truncate">{hub.subtext}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-[#176B50] text-white px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>SELECTED</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#E2E5E9]/60 flex items-center justify-between text-[10px] text-[#5F6A63] font-mono">
                        <span>Coordinates: {hub.lat.toFixed(3)}° N, {hub.lng.toFixed(3)}° E</span>
                        <span className="text-[#176B50] font-semibold">Commute Center</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E5E9] text-[11px] text-[#5F6A63] flex items-center justify-between">
                <span>Selected Office: <strong className="text-[#18231E]">{activeHub.name.split('·')[0]}</strong></span>
                <span className="font-mono text-[#176B50] font-bold">14 Residential Corridors</span>
              </div>
            </div>

            {/* Right Column: Interactive Map with Office Pinpoints & Two-Way Sync */}
            <div className="lg:col-span-6 bg-white border border-[#E2E5E9] rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E5E9] text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#176B50]" />
                  <span className="font-bold text-[#18231E]">
                    {currentCityData.name} Office Tech Hubs
                  </span>
                  <span className="text-[10px] font-mono text-[#5F6A63]">
                    • Click any pin to select
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#5F6A63]">
                  <span>Office: <strong className="text-[#176B50]">{activeHub.name.split('·')[0]}</strong></span>
                </div>
              </div>

              {/* Real Interactive MapLibre Map with pinpoint markers */}
              <div className="w-full h-[500px] bg-[#EBF0EC] border border-[#E2E5E9] rounded-xl relative overflow-hidden">
                <MapComponent
                  city={state.city}
                  workplace={state.wp}
                  candidateWp={activeHub}
                  flowPhase="workplace_select"
                  neighbourhoods={[]}
                  selectedId={null}
                  shortlist={[]}
                  propType={state.prop}
                  layers={{ n: false, w: true, c: false, r: false, t: false }}
                  currentStep={1}
                  onSelectNeighbourhood={() => {}}
                  onSelectWorkplaceHub={(hub) => handleSelectHub(hub)}
                  onMapClickForWorkplace={(lat, lng) => {
                    handleSelectHub({
                      name: `Custom Location (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
                      lat,
                      lng,
                    });
                  }}
                  hideBanners={true}
                  className="h-full w-full"
                />
              </div>

              {/* Workplace Confirmation Info Strip */}
              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E5E9] text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#5F6A63] block uppercase font-mono font-bold">
                    Target Office Location
                  </span>
                  <strong className="text-[#18231E]">{activeHub.name}</strong>
                  <span className="text-[10px] text-[#5F6A63] font-mono block">
                    {activeHub.lat.toFixed(3)}° N, {activeHub.lng.toFixed(3)}° E
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5F6A63] block font-mono">Catchment Reach</span>
                  <strong className="text-[#176B50]">14 Residential Zones</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
