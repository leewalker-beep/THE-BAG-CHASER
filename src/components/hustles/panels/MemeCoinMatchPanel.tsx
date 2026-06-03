import { MemeCoinMatch } from '../Tier2Match';
import type { PanelProps } from './types';

export function MemeCoinMatchPanel({ onBack, onExecute }: PanelProps) {
  return <MemeCoinMatch onResult={(s) => { onExecute('meme', s).then(() => onBack()); }} />;
}
