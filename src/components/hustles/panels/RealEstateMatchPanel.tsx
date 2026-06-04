import { RealEstateMatch } from '../Tier3Match';
import type { PanelProps } from './types';

export function RealEstateMatchPanel({ onBack, onExecute, isEmbedded }: PanelProps) {
  return <RealEstateMatch onResult={(s) => {
    onExecute('real_estate_empire', s).then(() => {
      if (!isEmbedded) onBack();
    });
  }} />;
}
