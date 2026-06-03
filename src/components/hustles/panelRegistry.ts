import React from 'react';
import type { PanelProps } from './panels/types';
import { LaborPanel } from './panels/LaborPanel';
import { DeliveryPanel } from './panels/DeliveryPanel';
import { FranchisePanel } from './panels/FranchisePanel';
import { SaaSPanel } from './panels/SaaSPanel';
import { FestivalPanel } from './panels/FestivalPanel';
import { EcomBrandPanel } from './panels/EcomBrandPanel';
import { AgencyPanel } from './panels/AgencyPanel';

import { PodPanel } from './panels/PodPanel';
import { StreetwearPanel } from './panels/StreetwearPanel';
import { GenericTreePanel } from './panels/GenericTreePanel';

import { SneakerDropMatchPanel } from './panels/SneakerDropMatchPanel';
import { TechFlipMatchPanel } from './panels/TechFlipMatchPanel';
import { MemeCoinMatchPanel } from './panels/MemeCoinMatchPanel';
import { ViralStreamMatchPanel } from './panels/ViralStreamMatchPanel';
import { RealEstateMatchPanel } from './panels/RealEstateMatchPanel';

export const PANEL_REGISTRY: Record<string, React.ComponentType<PanelProps>> = {
  // Interactive Match Layers (higher priority in original if/else)
  'drop': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'drop' }),
  'techFlip': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'techFlip' }),
  'tech_flip': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'tech_flip' }),
  'meme': MemeCoinMatchPanel,
  'cc': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'cc' }),
  'real_estate_empire': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'real_estate_empire' }),
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
  'agency_scale': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'agency_scale' }),
  'pod': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'pod' }),
  'vintage': (props) => React.createElement(GenericTreePanel, { ...props, hustleId: 'vintage' }),

};
