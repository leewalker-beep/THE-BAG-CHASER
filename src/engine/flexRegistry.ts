export interface FlexItemConfig {
  id: string;
  name: string;
  cost: number;
  monthlyUpkeep: number;
  tab: 'FLEX1' | 'FLEX2';
  description: string;
}

export const FLEX_ITEMS_REGISTRY: FlexItemConfig[] = [
  {
    id: 'ice-out-watch',
    name: 'Ice Out Watch',
    cost: 15000,
    monthlyUpkeep: 200,
    tab: 'FLEX1',
    description: 'Diamond encrusted timepiece. Loud and heavy.',
  },
  {
    id: 'fancy-supercar',
    name: 'Fancy Supercar',
    cost: 250000,
    monthlyUpkeep: 2500,
    tab: 'FLEX1',
    description: 'V12 engine, butterfly doors, zero practical utility.',
  },
  {
    id: 'luxury-penthouse',
    name: 'Luxury Penthouse',
    cost: 2500000,
    monthlyUpkeep: 15000,
    tab: 'FLEX1',
    description: 'Top floor views with floor-to-ceiling glass.',
  },
  {
    id: 'private-jet',
    name: 'Private Jet',
    cost: 12000000,
    monthlyUpkeep: 85000,
    tab: 'FLEX2',
    description: 'Skip the lines. Continental range.',
  },
  {
    id: 'mega-yacht',
    name: 'Mega Yacht',
    cost: 45000000,
    monthlyUpkeep: 250000,
    tab: 'FLEX2',
    description: 'A floating mansion for international waters.',
  },
];
