export type ThemeId = 'fashion' | 'tech' | 'beauty' | 'coffee';

export interface IndustryTheme {
  id: ThemeId;
  name: string;
  industry: string;
  badge: string;
  headlineMain: string;
  headlineItalic: string;
  description: string;
  ctaText: string;
  secondaryCta: string;
  brandName: string;
  accentClass: string;
  bgHeroClass: string;
  fontClass: string;
  cardAspect: string;
  categories: {
    title: string;
    slug: string;
    label: string;
    specs: string;
  }[];
  storyTitle: string;
  storySubtitle: string;
  storyDescription: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
}

export const INDUSTRY_THEMES: Record<ThemeId, IndustryTheme> = {
  fashion: {
    id: 'fashion',
    name: 'Minimalist Streetwear & Fashion',
    industry: 'Apparel & Luxury Goods',
    badge: 'Spring / Summer 2026 Collection',
    headlineMain: 'Quiet Luxury.',
    headlineItalic: 'Uncompromising Form.',
    description: 'Architectural silhouettes crafted from bespoke Japanese textiles, French terry, and surgical grade alloys.',
    ctaText: 'Shop Collection',
    secondaryCta: 'View Lookbook',
    brandName: 'ATELIER EDGE',
    accentClass: 'bg-white text-black hover:bg-neutral-200',
    bgHeroClass: 'bg-neutral-950 text-white',
    fontClass: 'font-editorial',
    cardAspect: 'aspect-[3/4]',
    categories: [
      { title: 'Footwear', slug: 'footwear', label: 'Carbon Plate Series', specs: '800 × 1060' },
      { title: 'Apparel', slug: 'apparel', label: '500 GSM Heavy Loopback', specs: '800 × 1060' },
      { title: 'Timepieces', slug: 'accessories', label: 'Automatic Mechanical', specs: '800 × 1060' },
      { title: 'Studio Audio', slug: 'tech', label: 'Beryllium Acoustics', specs: '800 × 1060' },
    ],
    storyTitle: 'Crafted Without Compromise.',
    storySubtitle: 'Built to Last Generations.',
    storyDescription: 'We source custom-milled French terry cotton, aerospace-grade titanium, and vegetable-tanned leather to produce garments that age with dignity.',
    stat1Number: '100%',
    stat1Label: 'Organic Materials',
    stat2Number: '0-Waste',
    stat2Label: 'Pattern Engineering',
  },
  tech: {
    id: 'tech',
    name: 'Next-Gen Electronics & Gadgets',
    industry: 'Consumer Hardware & Computing',
    badge: 'Hardware Revision 4.2 • Now Live',
    headlineMain: 'Pure Performance.',
    headlineItalic: 'Zero Bloatware.',
    description: 'Precision machined unibody devices engineered with edge silicon, active noise cancellation, and all-day thermal efficiency.',
    ctaText: 'Order Hardware',
    secondaryCta: 'Compare Specs',
    brandName: 'NEXUS HARDWARE',
    accentClass: 'bg-cyan-400 text-black hover:bg-cyan-300 font-mono tracking-wider',
    bgHeroClass: 'bg-neutral-950 text-white border-b border-cyan-500/20',
    fontClass: 'font-mono',
    cardAspect: 'aspect-square',
    categories: [
      { title: 'Processors & Edge', slug: 'tech', label: 'Silicon Architecture', specs: '800 × 800' },
      { title: 'Displays & Vision', slug: 'tech', label: '144Hz OLED Panels', specs: '800 × 800' },
      { title: 'Acoustics & Mic', slug: 'tech', label: 'Spatial Drivers', specs: '800 × 800' },
      { title: 'Power & Battery', slug: 'accessories', label: 'GaN Solid State', specs: '800 × 800' },
    ],
    storyTitle: 'Thermal Engineering.',
    storySubtitle: 'Precision CNC Machined.',
    storyDescription: 'Every aluminum enclosure is carved from a solid ingot of 6000-series alloy with aerospace tolerances under 0.02 millimeters.',
    stat1Number: '<1ms',
    stat1Label: 'Response Latency',
    stat2Number: '48h',
    stat2Label: 'Continuous Battery',
  },
  beauty: {
    id: 'beauty',
    name: 'Botanical Skincare & Wellness',
    industry: 'Clean Cosmetics & Body Care',
    badge: 'Dermatologist Tested • Cold-Pressed',
    headlineMain: 'Active Botanicals.',
    headlineItalic: 'Radiant Balance.',
    description: 'Biocompatible skincare formulated with adaptogenic herbs, plant peptides, and multi-weight hyaluronic acid.',
    ctaText: 'Discover Routine',
    secondaryCta: 'Skin Quiz',
    brandName: 'AURA BOTANICS',
    accentClass: 'bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-full',
    bgHeroClass: 'bg-[#F9F6F0] text-stone-900 border-b border-stone-200',
    fontClass: 'font-editorial',
    cardAspect: 'aspect-[4/5]',
    categories: [
      { title: 'Serums & Elixirs', slug: 'apparel', label: 'High-Potency Actives', specs: '800 × 1000' },
      { title: 'Moisture Crèmes', slug: 'apparel', label: 'Ceramide Barrier', specs: '800 × 1000' },
      { title: 'Cleansers & Balms', slug: 'accessories', label: 'Gentle pH Balancing', specs: '800 × 1000' },
      { title: 'Body & Bath', slug: 'accessories', label: 'Mineral Sea Salts', specs: '800 × 1000' },
    ],
    storyTitle: 'Wild-Harvested Potency.',
    storySubtitle: 'Zero Synthetic Fragrances.',
    storyDescription: 'Cold-pressed at peak botanical potency to preserve vital antioxidants and fatty acids. 100% recyclable glass and aluminum packaging.',
    stat1Number: '99.4%',
    stat1Label: 'Bio-Fermented Actives',
    stat2Number: '0%',
    stat2Label: 'Parabens & Sulfates',
  },
  coffee: {
    id: 'coffee',
    name: 'Artisan Coffee Roasters & Gear',
    industry: 'Specialty Food & Beverage',
    badge: 'Single Origin • Direct Trade Micro-Lots',
    headlineMain: 'Roasted Fresh.',
    headlineItalic: 'Brewed With Intention.',
    description: 'Ethically sourced high-altitude beans roasted in small batches on vintage cast-iron drum roasters in Portland and Melbourne.',
    ctaText: 'Shop Fresh Roasts',
    secondaryCta: 'Subscribe & Save',
    brandName: 'EMBER & DRIFT',
    accentClass: 'bg-[#B45309] text-white hover:bg-[#92400E] rounded-md font-bold',
    bgHeroClass: 'bg-[#1C1917] text-[#FAF7F5] border-b border-[#292524]',
    fontClass: 'font-editorial',
    cardAspect: 'aspect-square',
    categories: [
      { title: 'Single Origins', slug: 'food', label: 'Ethiopia & Colombia', specs: '800 × 800' },
      { title: 'Espresso Blends', slug: 'food', label: 'Rich Chocolate Notes', specs: '800 × 800' },
      { title: 'Filter & Drip', slug: 'food', label: 'Light Floral Washed', specs: '800 × 800' },
      { title: 'Brewing Gear', slug: 'accessories', label: 'Scales & Hand Grinders', specs: '800 × 800' },
    ],
    storyTitle: 'Direct Relationship Coffee.',
    storySubtitle: 'Fair Compensation at Farm Level.',
    storyDescription: 'We bypass intermediaries to pay 3x Fair Trade minimums directly to smallholder cooperatives in Huila, Yirgacheffe, and Antigua.',
    stat1Number: '88+',
    stat1Label: 'SCA Cup Score',
    stat2Number: '48h',
    stat2Label: 'Roast to Ship Guarantee',
  },
};
