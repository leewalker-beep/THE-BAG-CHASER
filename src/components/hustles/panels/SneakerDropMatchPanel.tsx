import { SneakerDropMatch } from '../Tier1Match';
import type { PanelProps } from './types';

export function SneakerDropMatchPanel({ onBack, onExecute }: PanelProps) {
  return <SneakerDropMatch onResult={(s) => { onExecute('drop', s).then(() => onBack()); }} />;
}
