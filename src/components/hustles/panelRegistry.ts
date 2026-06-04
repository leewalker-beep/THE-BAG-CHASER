import React from 'react';
import type { PanelProps } from './panels/types';
import { LaborPanel } from './panels/LaborPanel';
import { DeliveryPanel } from './panels/DeliveryPanel';
import { GenericTreePanel } from './panels/GenericTreePanel';
import { MemeCoinMatchPanel } from './panels/MemeCoinMatchPanel';
import { RealEstateMatchPanel } from './panels/RealEstateMatchPanel';
import { SneakerDropMatchPanel } from './panels/SneakerDropMatchPanel';
import { TechFlipMatchPanel } from './panels/TechFlipMatchPanel';
import { ViralStreamMatchPanel } from './panels/ViralStreamMatchPanel';
import { AgencyPanel } from './panels/AgencyPanel';
import { PodPanel } from './panels/PodPanel';
import { StreetwearPanel } from './panels/StreetwearPanel';

export const PANEL_REGISTRY: Record<string, React.ComponentType<PanelProps>> = {
  // Interactive Match Layers (higher priority in original if/else)
  'drop': SneakerDropMatchPanel,
  'techFlip': (props) => React.createElement(TechFlipMatchPanel, { ...props, hustleId: 'techFlip' }),
  'tech_flip': (props) => React.createElement(TechFlipMatchPanel, { ...props, hustleId: 'tech_flip' }),
  'meme': (props) => React.createElement(MemeCoinMatchPanel, { ...props, hustleId: 'meme' }),
  'cc': ViralStreamMatchPanel,
  'real_estate_empire': RealEstateMatchPanel,
  'venture_capital': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'venture_capital' }),
  'audio': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'audio' }),
  'policy_flip': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'policy_flip' }),
  'global_index': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'global_index' }),

  // Custom Dashboards
  'r_labor': LaborPanel,
  'r_delivery': DeliveryPanel,
  'global_franchise': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'global_franchise' }),
  'saas_mvp': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'saas_mvp' }),
  'festival': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'festival' }),
  'ecom_brand': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'ecom_brand' }),
  'agency_scale': AgencyPanel,
  'pod': PodPanel,
  'vintage': StreetwearPanel,
};
