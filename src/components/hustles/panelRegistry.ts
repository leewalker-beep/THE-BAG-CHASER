import React from 'react';
import type { PanelProps } from './panels/types';
import { GenericTreePanel } from './panels/GenericTreePanel';
import { MemeCoinMatchPanel } from './panels/MemeCoinMatchPanel';
import { RealEstateMatchPanel } from './panels/RealEstateMatchPanel';
import { SneakerDropMatchPanel } from './panels/SneakerDropMatchPanel';
import { TechFlipMatchPanel } from './panels/TechFlipMatchPanel';
import { ViralStreamMatchPanel } from './panels/ViralStreamMatchPanel';

import { LaborPanel } from './panels/LaborPanel';
import { DeliveryPanel } from './panels/DeliveryPanel';
import { SaaSPanel } from './panels/SaaSPanel';
import { EcomBrandPanel } from './panels/EcomBrandPanel';
import { FranchisePanel } from './panels/FranchisePanel';
import { FestivalPanel } from './panels/FestivalPanel';
import { AgencyPanel } from './panels/AgencyPanel';
import { PodPanel } from './panels/PodPanel';
import { StreetwearPanel } from './panels/StreetwearPanel';

export const PANEL_REGISTRY: Record<string, React.ComponentType<PanelProps>> = {
  // Interactive Match Layers
  'drop': SneakerDropMatchPanel,
  'techFlip': (props) => React.createElement(TechFlipMatchPanel, { ...props, hustleId: 'techFlip' }),
  'tech_flip': (props) => React.createElement(TechFlipMatchPanel, { ...props, hustleId: 'tech_flip' }),
  'meme': (props) => React.createElement(MemeCoinMatchPanel, { ...props, hustleId: 'meme' }),
  'cc': ViralStreamMatchPanel,
  'real_estate_empire': RealEstateMatchPanel,

  // Custom Dashboards
  'r_labor': (props) => React.createElement(LaborPanel, { ...props, hustleId: 'r_labor' }),
  'r_delivery': (props) => React.createElement(DeliveryPanel, { ...props, hustleId: 'r_delivery' }),
  'saas_mvp': (props) => React.createElement(SaaSPanel, { ...props, hustleId: 'saas_mvp' }),
  'ecom_brand': (props) => React.createElement(EcomBrandPanel, { ...props, hustleId: 'ecom_brand' }),
  'global_franchise': (props) => React.createElement(FranchisePanel, { ...props, hustleId: 'global_franchise' }),
  'festival': (props) => React.createElement(FestivalPanel, { ...props, hustleId: 'festival' }),
  'agency_scale': (props) => React.createElement(AgencyPanel, { ...props, hustleId: 'agency_scale' }),
  'pod': (props) => React.createElement(PodPanel, { ...props, hustleId: 'pod' }),
  'vintage': (props) => React.createElement(StreetwearPanel, { ...props, hustleId: 'vintage' }),

  // Generic Tree Fallbacks
  'venture_capital': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'venture_capital' }),
  'audio': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'audio' }),
  'policy_flip': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'policy_flip' }),
  'global_index': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'global_index' }),
};
