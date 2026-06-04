import { SneakerDropMatch } from '../Tier1Match';
import type { PanelProps } from './types';

export function SneakerDropMatchPanel({ onBack, onExecute, isEmbedded }: PanelProps) {
  return <SneakerDropMatch onResult={(s) => {
    onExecute('drop', s).then(() => {
      if (!isEmbedded) onBack();
    });
  }} />;
}
