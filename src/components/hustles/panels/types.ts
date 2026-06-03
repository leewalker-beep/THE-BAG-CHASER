import type { GameState } from '../../../store/types';

export interface PanelProps {
  hustleId: string;
  onBack: () => void;
  state: GameState;
  onExecute: (id: string, forceSuccess?: boolean) => Promise<void>;
}
