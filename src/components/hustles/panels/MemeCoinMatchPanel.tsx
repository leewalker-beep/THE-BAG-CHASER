import { MemeCoinMatch } from '../Tier2Match';
import type { PanelProps } from './types';

export function MemeCoinMatchPanel({ hustleId, onBack, onExecute }: PanelProps) {
  return <MemeCoinMatch onResult={(s) => { onExecute(hustleId, s).then(() => onBack()); }} />;
}
