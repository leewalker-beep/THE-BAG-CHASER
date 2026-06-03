import { ViralStreamMatch } from '../Tier2Match';
import type { PanelProps } from './types';

export function ViralStreamMatchPanel({ onBack, onExecute }: PanelProps) {
  return <ViralStreamMatch onResult={(s) => { onExecute('cc', s).then(() => onBack()); }} />;
}
