import { RealEstateMatch } from '../Tier3Match';
import type { PanelProps } from './types';

export function RealEstateMatchPanel({ onBack, onExecute }: PanelProps) {
  return <RealEstateMatch onResult={(s) => { onExecute('real_estate_empire', s).then(() => onBack()); }} />;
}
