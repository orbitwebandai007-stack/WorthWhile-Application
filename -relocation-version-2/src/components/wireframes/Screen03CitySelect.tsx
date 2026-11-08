import React, { useState } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, Check, MapPin, Building2, Info, ArrowLeft, RotateCcw } from 'lucide-react';
import { CITIES } from '../../data/relocationData';
import { CityKey } from '../../types';

export const Screen03CitySelect: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onStartNewPlan,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityKey>(state.city || 'blr');
  const [originCity, setOriginCity] = useState<string>(state.from || 'Lucknow');

  const cityOptions = [
    {
      key: 'blr',
      name: 'Bengaluru',
      state: 'Karnataka',
      hubs: 'Outer Ring Road, Whitefield, Electronic City, Koramangala',
      depositNorm: '6 – 10 months upfront',
      rentAvg1BHK: '₹18,000 – ₹24,000',
      rentAvg2BHK: '₹28,000 – ₹42,000',
      trafficIndex: 'Severe (42 min / 10 km peak)',
      techDensity: 'Tier 1 Tech Capital & GCC Super-Hub',
    },
    {
      key: 'ncr',
      name: 'Delhi NCR',
      state: 'Gurugram & Noida',
      hubs: 'DLF Cyber City, Golf Course Rd, Sector 62 Noida',
      depositNorm: '2 – 3 months upfront',
      rentAvg1BHK: '₹18,000 – ₹26,000',
      rentAvg2BHK: '₹30,000 – ₹48,000',
      trafficIndex: 'Rapid Metro / Wide 16-Lane Arterials',
      techDensity: 'Enterprise, Fintech & Unicorn Clusters',
    },
    {
      key: 'hyd',
      name: 'Hyderabad',
      state: 'Telangana',
      hubs: 'HITEC City, Gachibowli, Financial District',
      depositNorm: '2 – 3 months upfront',
      rentAvg1BHK: '₹15,000 – ₹20,000',
      rentAvg2BHK: '₹24,000 – ₹34,000',
      trafficIndex: 'Moderate (28 min / 10 km)',
      techDensity: 'Global Cloud Campus & MNC Tech Hub',
    },
    {
      key: 'mum',
      name: 'Mumbai',
      state: 'Maharashtra',
      hubs: 'BKC, Powai, Lower Parel, Goregaon East',
      depositNorm: '3 – 6 months upfront',
      rentAvg1BHK: '₹28,000 – ₹42,000',
      rentAvg2BHK: '₹48,000 – ₹75,000',
      trafficIndex: 'High Transit (Local Trains & Metro)',
      techDensity: 'BFSI, Media, Conglomerates & SaaS',
    },
    {
      key: 'pun',
      name: 'Pune',
      state: 'Maharashtra',
      hubs: 'Hinjawadi Phase 1-3, Kharadi, Magarpatta',
      depositNorm: '2 – 3 months upfront',
      rentAvg1BHK: '₹14,000 – ₹18,000',
      rentAvg2BHK: '₹22,000 – ₹30,000',
      trafficIndex: 'Moderate (Hinjawadi flyover peak choke)',
      techDensity: 'Automotive R&D & Product Engineering',
    },
    {
      key: 'che',
      name: 'Chennai',
      state: 'Tamil Nadu',
      hubs: 'OMR Corridor, Taramani, Guindy',
      depositNorm: '4 – 6 months upfront',
      rentAvg1BHK: '₹13,000 – ₹17,000',
      rentAvg2BHK: '₹20,000 – ₹28,000',
      trafficIndex: 'Stable MRTS & Radial Corridors',
      techDensity: 'SaaS Capital, DeepTech & Auto R&D',
    },
  ];

  const handleConfirmCity = () => {
    const chosenCityData = CITIES[selectedCity] || CITIES.blr;
    const defaultHub = chosenCityData.hubs[0];

    onUpdateState({
      city: selectedCity,
      from: originCity.trim() || 'Lucknow',
      wp: {
        name: defaultHub[0],
        lat: defaultHub[1],
        lng: defaultHub[2],
      },
      wpConfirmed: false,
      flowPhase: 'workplace_select',
      sel: [], // reset shortlisted areas for new city
      depositMonthsOverride: undefined,
      brokerageOverride: undefined,
    });

    onNavigate(4); // Advance to Screen 4 (Workplace Selection)
  };

  const activeCityData = CITIES[selectedCity] || CITIES.blr;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="City & Office"
        onNavigate={onNavigate}
        fromCity={originCity}
        destCityName={activeCityData.name}
        annualLpa={state.annualLpa || 28}
        onStartNewPlan={onStartNewPlan}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          {/* Step Indicator & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#18231E] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                1
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#176B50] font-bold tracking-wider">
                  STAGE 01 OF 06 · DESTINATION METRO ARCHITECTURE
                </span>
                <h1 className="text-xl font-bold text-[#18231E]">
                  Where is your next job offer or career opportunity located?
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6A63]">Origin City:</span>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="Current city"
                className="px-2.5 py-1 bg-white border border-[#E2E5E9] rounded-md font-semibold text-[#18231E] text-xs focus:outline-none focus:border-[#176B50]"
              />
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-3">
            Rental economics, upfront security deposit rules, and commute friction vary dramatically across Indian metros. Select your target city to calibrate verified market benchmarks.
          </p>

          {/* 6-City Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {cityOptions.map((city) => {
              const isSelected = selectedCity === city.key;

              return (
                <div
                  key={city.key}
                  onClick={() => setSelectedCity(city.key as CityKey)}
                  className={`p-5 rounded-xl border bg-white cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#176B50] ring-2 ring-[#176B50]/20 shadow-xs'
                      : 'border-[#E2E5E9] hover:border-[#18231E]/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#5F6A63] uppercase">
                        {city.state}
                      </span>
                      <h3 className="text-base font-bold text-[#18231E] mt-0.5">
                        {city.name}
                      </h3>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#176B50] bg-[#176B50] text-white'
                          : 'border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#F0F2F4]">
                      <span className="text-[#5F6A63]">Deposit Custom:</span>
                      <strong className={city.key === 'blr' ? 'text-[#C2410C]' : 'text-[#18231E]'}>
                        {city.depositNorm}
                      </strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#F0F2F4]">
                      <span className="text-[#5F6A63]">1 BHK Rent:</span>
                      <span className="font-mono text-[#18231E]">{city.rentAvg1BHK}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#F0F2F4]">
                      <span className="text-[#5F6A63]">2 BHK Rent:</span>
                      <span className="font-mono text-[#18231E]">{city.rentAvg2BHK}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#F0F2F4]">
                      <span className="text-[#5F6A63]">Traffic Index:</span>
                      <span className="text-[#18231E] truncate max-w-[150px]">{city.trafficIndex}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0F2F4] text-[11px] text-[#5F6A63]">
                    <span className="block font-semibold text-[#18231E] truncate">{city.techDensity}</span>
                    <span className="truncate block mt-0.5">{city.hubs}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected City Comparison Benchmark Banner & Navigation Footer */}
        <div className="pt-6 border-t border-[#E2E5E9] mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E8F4EF] text-[#176B50] shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs text-[#5F6A63]">
              Selected Destination: <strong className="text-[#18231E]">{activeCityData.name}</strong> • Standard security deposit locks <strong>{activeCityData.defaultDepositMonths} months rent</strong> upfront.
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="px-4 py-2 rounded-lg border border-[#E2E5E9] text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] transition-colors cursor-pointer"
            >
              Back to Overview
            </button>
            <button
              type="button"
              onClick={handleConfirmCity}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs"
            >
              <span>Confirm Destination & Choose Workplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
