export const SEED_CATEGORIES = [
  { id: 1, name: 'Footwear', slug: 'footwear', description: 'Engineered for comfort and high-aesthetic motion.' },
  { id: 2, name: 'Apparel', slug: 'apparel', description: 'Minimalist streetwear crafted from heavy organic fabrics.' },
  { id: 3, name: 'Accessories', slug: 'accessories', description: 'Precision crafted everyday essentials.' },
  { id: 4, name: 'Audio & Tech', slug: 'tech', description: 'Studio-grade acoustics and edge engineering.' },
];

export const SEED_PRODUCTS = [
  {
    id: 'prod_lumina_runner_01',
    categoryId: 1,
    title: 'AeroGlide Carbon Sneakers',
    slug: 'aeroglide-carbon-sneakers',
    description: 'Engineered with a responsive carbon-fiber plate and breathable engineered mesh. Minimalist profile designed for both marathon performance and city streets.',
    basePrice: 16500, // $165.00
    compareAtPrice: 19500,
    primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    variants: [
      { id: 'var_aero_01', sku: 'AERO-BLK-41', title: 'Midnight Black / US 8', inventoryQuantity: 12 },
      { id: 'var_aero_02', sku: 'AERO-BLK-42', title: 'Midnight Black / US 9', inventoryQuantity: 18 },
      { id: 'var_aero_03', sku: 'AERO-BLK-43', title: 'Midnight Black / US 10', inventoryQuantity: 15 },
      { id: 'var_aero_04', sku: 'AERO-WHT-42', title: 'Alabaster White / US 9', inventoryQuantity: 8 },
    ],
  },
  {
    id: 'prod_lumina_hoodie_02',
    categoryId: 2,
    title: 'Heavyweight Loopback Hoodie',
    slug: 'heavyweight-loopback-hoodie',
    description: 'Cut from custom 500 GSM French Terry organic cotton. Features dropped shoulders, double-stitched kangaroo pocket, and rib-knit cuffs that retain their shape.',
    basePrice: 9800, // $98.00
    compareAtPrice: null,
    primaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    variants: [
      { id: 'var_hood_01', sku: 'HOOD-VNTG-S', title: 'Washed Charcoal / S', inventoryQuantity: 20 },
      { id: 'var_hood_02', sku: 'HOOD-VNTG-M', title: 'Washed Charcoal / M', inventoryQuantity: 35 },
      { id: 'var_hood_03', sku: 'HOOD-VNTG-L', title: 'Washed Charcoal / L', inventoryQuantity: 24 },
      { id: 'var_hood_04', sku: 'HOOD-VNTG-XL', title: 'Washed Charcoal / XL', inventoryQuantity: 14 },
    ],
  },
  {
    id: 'prod_lumina_watch_03',
    categoryId: 3,
    title: 'Chronosphere Automatic Watch',
    slug: 'chronosphere-automatic-watch',
    description: 'Japanese mechanical movement encased in 316L surgical stainless steel. Sapphire crystal with anti-reflective coating, paired with Italian vegetable-tanned leather.',
    basePrice: 28500, // $285.00
    compareAtPrice: 34000,
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    variants: [
      { id: 'var_wtch_01', sku: 'WTCH-SLV-BRN', title: 'Brushed Silver / Cognac Strap', inventoryQuantity: 10 },
      { id: 'var_wtch_02', sku: 'WTCH-BLK-BLK', title: 'Matte Obsidian / Black Strap', inventoryQuantity: 15 },
    ],
  },
  {
    id: 'prod_lumina_headphones_04',
    categoryId: 4,
    title: 'Horizon Studio Over-Ear Headphones',
    slug: 'horizon-studio-headphones',
    description: 'Bespoke 40mm beryllium drivers delivering spatial audiophile sound. Hybrid active noise cancellation with 45 hours battery life and memory foam lambskin earcups.',
    basePrice: 24000, // $240.00
    compareAtPrice: null,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    variants: [
      { id: 'var_hdph_01', sku: 'HDPH-SLV', title: 'Anodized Silver', inventoryQuantity: 22 },
      { id: 'var_hdph_02', sku: 'HDPH-DRK', title: 'Space Graphite', inventoryQuantity: 30 },
    ],
  },
  {
    id: 'prod_lumina_backpack_05',
    categoryId: 3,
    title: 'Modular Commuter Backpack 22L',
    slug: 'modular-commuter-backpack',
    description: 'Weatherproof Cordura 840D nylon with Fidlock magnetic buckles. Dedicated 16" padded laptop sleeve and expandable side hydration pockets.',
    basePrice: 14500, // $145.00
    compareAtPrice: 17500,
    primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    variants: [
      { id: 'var_bp_01', sku: 'BP-22L-BLK', title: 'Stealth Black', inventoryQuantity: 25 },
      { id: 'var_bp_02', sku: 'BP-22L-OLV', title: 'Military Olive', inventoryQuantity: 18 },
    ],
  },
  {
    id: 'prod_lumina_sunglasses_06',
    categoryId: 3,
    title: 'Solstice Polarized Sunglasses',
    slug: 'solstice-polarized-sunglasses',
    description: 'Handcrafted Italian Mazzucchelli acetate frame with Carl Zeiss polarized lenses offering 100% UV400 protection.',
    basePrice: 11000, // $110.00
    compareAtPrice: null,
    primaryImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    variants: [
      { id: 'var_sg_01', sku: 'SG-TOR-AMB', title: 'Classic Tortoise / Amber Lens', inventoryQuantity: 16 },
      { id: 'var_sg_02', sku: 'SG-BLK-SMK', title: 'Gloss Black / Smoke Lens', inventoryQuantity: 20 },
    ],
  },
];
