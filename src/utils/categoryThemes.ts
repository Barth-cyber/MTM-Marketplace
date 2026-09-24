import { 
  Armchair, 
  Cpu, 
  HardHat, 
  Tractor, 
  Zap, 
  Wrench, 
  Layers, 
  Flame,
  LucideIcon
} from 'lucide-react';

export interface CategoryTheme {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentBg: string;
  accentText: string;
  accentHoverBg: string;
  borderHover: string;
  lightBg: string;
  tagColor: string;
  hexPrimary: string;
  icon: LucideIcon;
  pillGradient?: string;
  accentRing: string;
}

// Minimalist theme configuration (Horse Blood Gradient, Shiny Silver, Dark-Gray)
const BASE_MINIMAL_THEME: Omit<CategoryTheme, 'name' | 'icon'> = {
  badgeBg: 'bg-slate-100',
  badgeText: 'text-slate-800',
  badgeBorder: 'border-slate-200',
  accentBg: 'bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46]',
  accentText: 'text-[#8B1520]',
  accentHoverBg: 'hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531]',
  borderHover: 'hover:border-slate-400',
  lightBg: 'bg-slate-50',
  tagColor: 'text-slate-700',
  hexPrimary: '#8B1520',
  pillGradient: 'from-[#48060C] via-[#7A101A] to-[#D83A46]',
  accentRing: 'focus:ring-rose-400',
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  'Metal Welding and Fabrication': {
    ...BASE_MINIMAL_THEME,
    name: 'Metal Welding and Fabrication',
    icon: Flame,
  },
  'Metal Welding & Fabrication': {
    ...BASE_MINIMAL_THEME,
    name: 'Metal Welding & Fabrication',
    icon: Flame,
  },
  'Furniture Manufacturing': {
    ...BASE_MINIMAL_THEME,
    name: 'Furniture Manufacturing',
    icon: Armchair,
  },
  'Industrial Machinery': {
    ...BASE_MINIMAL_THEME,
    name: 'Industrial Machinery',
    icon: Cpu,
  },
  'Construction': {
    ...BASE_MINIMAL_THEME,
    name: 'Construction',
    icon: HardHat,
  },
  'Agriculture': {
    ...BASE_MINIMAL_THEME,
    name: 'Agriculture',
    icon: Tractor,
  },
  'Electrical': {
    ...BASE_MINIMAL_THEME,
    name: 'Electrical',
    icon: Zap,
  },
  'Workshop Tools': {
    ...BASE_MINIMAL_THEME,
    name: 'Workshop Tools',
    icon: Wrench,
  },
  'Materials': {
    ...BASE_MINIMAL_THEME,
    name: 'Materials',
    icon: Layers,
  },
};

export const getCategoryTheme = (categoryName?: string): CategoryTheme => {
  if (!categoryName) return CATEGORY_THEMES['Industrial Machinery'];

  if (CATEGORY_THEMES[categoryName]) {
    return CATEGORY_THEMES[categoryName];
  }

  const lower = categoryName.toLowerCase();

  if (
    lower.includes('weld') || 
    lower.includes('fabricat') || 
    lower.includes('metal') || 
    lower.includes('sheet metal') || 
    lower.includes('bending') ||
    lower.includes('shearing') ||
    lower.includes('pipe')
  ) {
    return CATEGORY_THEMES['Metal Welding and Fabrication'];
  }

  if (
    lower.includes('furniture') || 
    lower.includes('woodworking') || 
    lower.includes('panel saw') || 
    lower.includes('edge bander') || 
    lower.includes('planer') || 
    lower.includes('sander') || 
    lower.includes('upholstery') ||
    lower.includes('cutting') ||
    lower.includes('wood shaping')
  ) {
    return CATEGORY_THEMES['Furniture Manufacturing'];
  }

  if (
    lower.includes('construction') || 
    lower.includes('excavator') || 
    lower.includes('concrete') || 
    lower.includes('mixer') || 
    lower.includes('compactor') ||
    lower.includes('scaffolding')
  ) {
    return CATEGORY_THEMES['Construction'];
  }

  if (
    lower.includes('agri') || 
    lower.includes('tractor') || 
    lower.includes('harvester') || 
    lower.includes('irrigation') || 
    lower.includes('feed mill') ||
    lower.includes('food processing')
  ) {
    return CATEGORY_THEMES['Agriculture'];
  }

  if (
    lower.includes('electric') || 
    lower.includes('generator') || 
    lower.includes('transformer') || 
    lower.includes('switchgear') || 
    lower.includes('cable') ||
    lower.includes('inverter')
  ) {
    return CATEGORY_THEMES['Electrical'];
  }

  if (
    lower.includes('tool') || 
    lower.includes('drill') || 
    lower.includes('grinder') || 
    lower.includes('welder') || 
    lower.includes('cutter') ||
    lower.includes('hydraulic tool')
  ) {
    return CATEGORY_THEMES['Workshop Tools'];
  }

  if (
    lower.includes('material') || 
    lower.includes('timber') || 
    lower.includes('steel') || 
    lower.includes('fastener') || 
    lower.includes('consumable')
  ) {
    return CATEGORY_THEMES['Materials'];
  }

  return CATEGORY_THEMES['Industrial Machinery'];
};
