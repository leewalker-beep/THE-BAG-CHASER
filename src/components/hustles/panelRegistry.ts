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

import { SneakerDropMatchPanel } from './panels/SneakerDropMatchPanel';
import { TechFlipMatchPanel } from './panels/TechFlipMatchPanel';
import { MemeCoinMatchPanel } from './panels/MemeCoinMatchPanel';
import { ViralStreamMatchPanel } from './panels/ViralStreamMatchPanel';
import { RealEstateMatchPanel } from './panels/RealEstateMatchPanel';

export const PANEL_REGISTRY: Record<string, React.ComponentType<PanelProps>> = {
  // Interactive Match Layers (higher priority in original if/else)
  'drop': SneakerDropMatchPanel,
  'techFlip': TechFlipMatchPanel,
  'tech_flip': TechFlipMatchPanel,
  'meme': MemeCoinMatchPanel,
  'cc': ViralStreamMatchPanel,
  'real_estate_empire': RealEstateMatchPanel,

  // Custom Dashboards
  'r_labor': LaborPanel,
  'r_delivery': DeliveryPanel,
  'global_franchise': FranchisePanel,
  'saas_mvp': SaaSPanel,
  'festival': FestivalPanel,
  'ecom_brand': EcomBrandPanel,
  'agency_scale': AgencyPanel,
  'pod': PodPanel,
  'vintage': StreetwearPanel,

};
