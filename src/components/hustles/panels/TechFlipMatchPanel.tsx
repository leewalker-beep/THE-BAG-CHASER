import { PalletFlippingMatch } from '../Tier1Match';
import type { PanelProps } from './types';

export function TechFlipMatchPanel({ hustleId, onBack, onExecute }: PanelProps) {
  return <PalletFlippingMatch onResult={(s) => { onExecute(hustleId, s).then(() => onBack()); }} />;
}
