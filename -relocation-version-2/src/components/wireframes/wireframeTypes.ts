import {
  RelocationState,
  ScoredNeighbourhood,
  MovingCostBreakdown,
  RelocationVerdict,
  WorkplaceHub,
} from '../../types';
import { RouteInfo } from '../../services/routingService';

export interface WireframeScreenProps {
  state: RelocationState;
  onUpdateState: (updates: Partial<RelocationState>) => void;
  onNavigate: (screenIndex: number) => void;
  scoredNeighbourhoods: ScoredNeighbourhood[];
  chosenNeighbourhood: ScoredNeighbourhood;
  movingCosts: MovingCostBreakdown;
  verdict: RelocationVerdict;
  routeMap?: Map<string, RouteInfo>;
  onRouteLoaded?: (areaName: string, route: RouteInfo) => void;
  candidateWp?: WorkplaceHub | null;
  onSelectCandidateWp?: (wp: WorkplaceHub) => void;
  onStartNewPlan?: () => void;
  onResumePlan?: () => void;
}
