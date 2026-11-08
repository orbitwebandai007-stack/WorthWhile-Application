import React, { useState, useEffect } from 'react';
import { WireframeHeader } from './WireframeHeader';
import { WireframeScreenProps } from './wireframeTypes';
import { ArrowRight, ArrowLeft, Home, Car, Utensils, Sparkles, Check, Clock, Layers, ShieldCheck } from 'lucide-react';
import { CITIES, PROPERTIES, formatINR } from '../../data/relocationData';
import { PropertyType, TransportMode, FoodHabit, LifestyleTier } from '../../types';

export const Screen06LifestylePreferences: React.FC<WireframeScreenProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onStartNewPlan,
}) => {
  const [propType, setPropType] = useState<PropertyType>(state.prop || 'b2');
  const [transportMode, setTransportMode] = useState<TransportMode>(state.tr || 'cab');
  const [foodHabit, setFoodHabit] = useState<FoodHabit>(state.food || 'mix');
  const [lifestyleTier, setLifestyleTier] = useState<LifestyleTier>(state.life || 'mod');
  const [maxCommuteMin, setMaxCommuteMin] = useState<number>(state.maxc || 40);

  const currentCityData = CITIES[state.city] || CITIES.blr;

  // Sync to state
  useEffect(() => {
    onUpdateState({
      prop: propType,
      tr: transportMode,
      food: foodHabit,
      life: lifestyleTier,
      maxc: maxCommuteMin,
    });
  }, [propType, transportMode, foodHabit, lifestyleTier, maxCommuteMin]);

  const handleNext = () => {
    onNavigate(7); // Proceed to Screen 07 (Corridor Discovery & Map)
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#18231E] flex flex-col select-none">
      <WireframeHeader
        activeNav="Compensation"
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
                LIFESTYLE & ACCOMMODATION PROFILE
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#18231E]">
                How do you plan to live in {currentCityData.name}?
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5F6A63]">Monthly In-Hand:</span>
              <strong className="text-[#176B50] font-mono">{formatINR(state.sal || 174500)}/mo</strong>
            </div>
          </div>

          <p className="text-xs text-[#5F6A63] mt-2.5">
            Your preferences dynamically calibrate monthly recurring burn, upfront rental deposit benchmarks, and filter eligible neighbourhoods.
          </p>

          {/* Action Navigation Bar in Clear View below Step & Subheading */}
          <div className="mt-5 mb-2 px-5 py-3.5 bg-white border border-[#E2E5E9] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate(5)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E5E9] bg-white text-xs font-semibold text-[#5F6A63] hover:text-[#18231E] hover:bg-[#F8F9FA] transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Compensation</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5F6A63] hidden sm:inline">Preferences:</span>
              <span className="font-bold text-[#176B50] bg-[#E8F4EF] px-3 py-1.5 rounded-lg font-mono text-xs border border-[#176B50]/20">
                {propType.toUpperCase()}
              </span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Commute: <strong className="text-[#18231E] uppercase font-mono">{transportMode}</strong></span>
              <span className="text-[#8C9690] hidden sm:inline">•</span>
              <span className="text-[#5F6A63] hidden sm:inline">Max: <strong className="text-[#18231E] font-mono">{maxCommuteMin}m</strong></span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#18231E] text-white text-xs font-semibold hover:bg-[#176B50] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Proceed to Corridor Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Column Preference Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Column 1: Housing & Accommodation */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E5E9]">
                <Home className="w-4 h-4 text-[#176B50]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                  1. Housing Configuration
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'b1' as PropertyType, label: '1 BHK Independent Unit', desc: '₹18k – ₹24k / mo' },
                  { id: 'b2' as PropertyType, label: '2 BHK Society Apartment', desc: '₹28k – ₹42k / mo (Recommended)' },
                  { id: 'studio' as PropertyType, label: 'Private Studio / Co-Living', desc: '₹22k – ₹30k all-inclusive' },
                  { id: 'sr' as PropertyType, label: 'Room in Shared 2BHK/3BHK', desc: '₹14k – ₹20k / mo' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPropType(item.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                      propType === item.id
                        ? 'border-[#176B50] bg-[#E8F4EF]/50 font-semibold text-[#18231E]'
                        : 'border-[#E2E5E9] text-[#5F6A63] hover:border-[#18231E]/30'
                    }`}
                  >
                    <div>
                      <div className="text-[#18231E] font-medium">{item.label}</div>
                      <div className="text-[10px] text-[#5F6A63]">{item.desc}</div>
                    </div>
                    {propType === item.id && <Check className="w-4 h-4 text-[#176B50]" />}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E5E9] text-[11px] text-[#5F6A63]">
                Deposit benchmark in {currentCityData.name}: <strong>{currentCityData.defaultDepositMonths} months rent</strong>.
              </div>
            </div>

            {/* Column 2: Commute Mode & Transit */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E5E9]">
                <Car className="w-4 h-4 text-[#176B50]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                  2. Daily Commute Mode
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'cab' as TransportMode, label: 'Cabs / Auto (Uber & Ola)', desc: '₹8k – ₹14k / mo' },
                  { id: 'two' as TransportMode, label: 'Personal Two-Wheeler / Bike', desc: '₹2.5k – ₹4.5k / mo' },
                  { id: 'pub' as TransportMode, label: 'Metro & Public Transit', desc: '₹1.5k – ₹3k / mo' },
                  { id: 'car' as TransportMode, label: 'Personal Car (Fuel & Parking)', desc: '₹10k – ₹16k / mo' },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setTransportMode(mode.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                      transportMode === mode.id
                        ? 'border-[#176B50] bg-[#E8F4EF]/50 font-semibold text-[#18231E]'
                        : 'border-[#E2E5E9] text-[#5F6A63] hover:border-[#18231E]/30'
                    }`}
                  >
                    <div>
                      <div className="text-[#18231E] font-medium">{mode.label}</div>
                      <div className="text-[10px] text-[#5F6A63]">{mode.desc}</div>
                    </div>
                    {transportMode === mode.id && <Check className="w-4 h-4 text-[#176B50]" />}
                  </div>
                ))}
              </div>

              {/* Max One-Way Commute Slider */}
              <div className="space-y-1.5 pt-2 border-t border-[#F0F2F4]">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#18231E]">Max Commute Ceiling:</span>
                  <span className="font-mono font-bold text-[#176B50]">{maxCommuteMin} mins</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={maxCommuteMin}
                  onChange={(e) => setMaxCommuteMin(Number(e.target.value))}
                  className="w-full accent-[#176B50] cursor-pointer"
                />
              </div>
            </div>

            {/* Column 3: Food Habits & Discretionary Tier */}
            <div className="bg-white border border-[#E2E5E9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E5E9]">
                <Utensils className="w-4 h-4 text-[#176B50]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18231E]">
                  3. Food & Lifestyle Tier
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-[#5F6A63]">Food Habits</label>
                {[
                  { id: 'cook' as FoodHabit, label: 'Home Cooked (Cook Maid + Groceries)', desc: '₹9k – ₹13k / mo' },
                  { id: 'mix' as FoodHabit, label: 'Hybrid (Cook + Weekend Swiggy)', desc: '₹14k – ₹18k / mo' },
                  { id: 'out' as FoodHabit, label: 'Frequent Swiggy / Dining Out', desc: '₹20k – ₹28k / mo' },
                ].map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFoodHabit(f.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                      foodHabit === f.id
                        ? 'border-[#176B50] bg-[#E8F4EF]/50 font-semibold text-[#18231E]'
                        : 'border-[#E2E5E9] text-[#5F6A63] hover:border-[#18231E]/30'
                    }`}
                  >
                    <div>
                      <div className="text-[#18231E] font-medium">{f.label}</div>
                      <div className="text-[10px] text-[#5F6A63]">{f.desc}</div>
                    </div>
                    {foodHabit === f.id && <Check className="w-4 h-4 text-[#176B50]" />}
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F0F2F4]">
                <label className="text-[11px] font-bold uppercase text-[#5F6A63]">Discretionary Spend Tier</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'bud' as LifestyleTier, label: 'Budget' },
                    { id: 'mod' as LifestyleTier, label: 'Moderate' },
                    { id: 'comf' as LifestyleTier, label: 'Premium' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setLifestyleTier(tier.id)}
                      className={`py-2 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                        lifestyleTier === tier.id
                          ? 'border-[#176B50] bg-[#176B50] text-white font-bold'
                          : 'border-[#E2E5E9] bg-white text-[#5F6A63]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
