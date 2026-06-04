export interface HustleTone {
  font: string;
  colors: { primary: string; secondary: string; accent: string };
  animation: string;
  interaction: string;
  icon: string;
  theme: string;
}

export const HUSTLE_TONES: Record<string, HustleTone> = {
  r_labor: { font: 'font-mono', colors: { primary: '#4a4a4a', secondary: '#2d2d2d', accent: '#ff6b35' }, animation: 'heavy', interaction: 'click-heavy', icon: '💪', theme: 'gritty' },
  r_delivery: { font: 'font-sans', colors: { primary: '#00d4ff', secondary: '#0099cc', accent: '#ffdd00' }, animation: 'fast', interaction: 'click-soft', icon: '🛵', theme: 'urban' },
  cc: { font: 'font-sans', colors: { primary: '#ff6bff', secondary: '#cc00cc', accent: '#00ffcc' }, animation: 'glossy', interaction: 'click-soft', icon: '🤳', theme: 'glossy' },
  pod: { font: 'font-serif', colors: { primary: '#ffffff', secondary: '#cccccc', accent: '#ffcc00' }, animation: 'studio', interaction: 'click-soft', icon: '🎙️', theme: 'studio' },
  audio: { font: 'font-handwritten', colors: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#f472b6' }, animation: 'creative', interaction: 'click-soft', icon: '🎵', theme: 'creative' },
  drop: { font: 'font-extrabold', colors: { primary: '#ff4500', secondary: '#ff0000', accent: '#ffdd00' }, animation: 'hype', interaction: 'fomo-pulse', icon: '📦', theme: 'hype' },
  vintage: { font: 'font-serif', colors: { primary: '#d4af37', secondary: '#8b6914', accent: '#4a4a4a' }, animation: 'retro', interaction: 'click-soft', icon: '👕', theme: 'retro' },
  saas_mvp: { font: 'font-mono', colors: { primary: '#00ff00', secondary: '#00cc00', accent: '#00ffff' }, animation: 'tech', interaction: 'click-soft', icon: '💻', theme: 'tech' },
  agency_scale: { font: 'font-sans', colors: { primary: '#4f46e5', secondary: '#3730a3', accent: '#f59e0b' }, animation: 'corporate', interaction: 'click-soft', icon: '🏢', theme: 'corporate' },
  ecom_brand: { font: 'font-sans', colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#ffffff' }, animation: 'premium', interaction: 'click-soft', icon: '🏢', theme: 'premium' },
  festival: { font: 'font-bold', colors: { primary: '#ec4899', secondary: '#db2777', accent: '#fef08a' }, animation: 'energetic', interaction: 'click-soft', icon: '🎪', theme: 'energetic' },
  global_franchise: { font: 'font-serif', colors: { primary: '#fbbf24', secondary: '#f59e0b', accent: '#ffffff' }, animation: 'empire', interaction: 'click-heavy', icon: '🌍', theme: 'empire' },
  venture_capital: { font: 'font-thin', colors: { primary: '#a78bfa', secondary: '#7c3aed', accent: '#f0f0f0' }, animation: 'elite', interaction: 'click-soft', icon: '🦄', theme: 'elite' },
  real_estate_empire: { font: 'font-serif', colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fef08a' }, animation: 'architectural', interaction: 'click-heavy', icon: '🏙️', theme: 'architectural' },
  policy_flip: { font: 'font-serif', colors: { primary: '#dc2626', secondary: '#991b1b', accent: '#fef08a' }, animation: 'official', interaction: 'click-heavy', icon: '⚖️', theme: 'official' },
  global_index: { font: 'font-mono', colors: { primary: '#22d3ee', secondary: '#0891b2', accent: '#ffffff' }, animation: 'futuristic', interaction: 'click-soft', icon: '🌍', theme: 'futuristic' },
  r_plasma: { font: 'font-sans', colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fef08a' }, animation: 'clinical', interaction: 'click-heavy', icon: '🩸', theme: 'clinical' },
};
