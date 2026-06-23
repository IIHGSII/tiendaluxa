process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to load environment variables
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_API_KEY is not defined in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hardcoded products matching the current catalogue in app/data/products.js
const productsToSeed = [
  {
    slug: 'bleu-de-chanel-edp',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    category: 'masculino',
    subcategory: 'Eau de Parfum',
    price: 985000,
    priceOld: 1200000,
    ml: '100ml',
    description: 'Una fragancia fresca y maderada de extraordinaria elegancia. Ámbar, sándalo y cedro se fusionan en una composición audaz que define la masculinidad contemporánea.',
    image: '/prod-bleu-chanel.png',
    imageFallback: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.9,
    reviews: 248
  },
  {
    slug: 'oud-wood-tom-ford',
    name: 'Oud Wood',
    brand: 'Tom Ford',
    category: 'masculino',
    subcategory: 'Eau de Parfum',
    price: 1350000,
    priceOld: null,
    ml: '100ml',
    description: 'Un perfume oriental de madera de oud excepcional. Maderas raras, vainilla y sándalo crean una experiencia olfativa de incomparable lujo y profundidad.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.8,
    reviews: 195
  },
  {
    slug: 'y-ysl-edp',
    name: 'Y Eau de Parfum',
    brand: 'Yves Saint Laurent',
    category: 'masculino',
    subcategory: 'Eau de Parfum',
    price: 720000,
    priceOld: 850000,
    ml: '100ml',
    description: 'Bergamota vibrante, manzana verde y jengibre se abren paso hacia un corazón de salvia y cedro. Moderno, fresco e irresistiblemente sofisticado.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    isNew: true,
    isBestseller: false,
    inStock: true,
    rating: 4.7,
    reviews: 132
  },
  {
    slug: 'sauvage-dior-edp',
    name: 'Sauvage',
    brand: 'Dior',
    category: 'masculino',
    subcategory: 'Eau de Parfum',
    price: 890000,
    priceOld: null,
    ml: '100ml',
    description: 'Inspirado en cielos abiertos y paisajes salvajes, Sauvage es intenso, noble y fresco a la vez. Una fragancia de contrastes: bergamota de Calabria y madera ambarada.',
    image: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.9,
    reviews: 312
  },
  {
    slug: 'chanel-n5-edp',
    name: 'N°5',
    brand: 'Chanel',
    category: 'femenino',
    subcategory: 'Eau de Parfum',
    price: 1150000,
    priceOld: null,
    ml: '100ml',
    description: 'La fragancia más icónica del mundo. Ylang-ylang, jazmín y rosa de mayo envueltos en un acorde aldehídico único. Elegancia intemporal en cada gota.',
    image: '/prod-bleu-chanel.png',
    imageFallback: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.9,
    reviews: 408
  },
  {
    slug: 'miss-dior-edp',
    name: 'Miss Dior',
    brand: 'Dior',
    category: 'femenino',
    subcategory: 'Eau de Parfum',
    price: 875000,
    priceOld: 1000000,
    ml: '100ml',
    description: 'Un bouquet floral de peonías y rosas de Grasse, con fondo de pachulí italiano. Romántica, fresca y deliciosamente femenina.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.8,
    reviews: 276
  },
  {
    slug: 'la-vie-est-belle-lancome',
    name: 'La Vie est Belle',
    brand: 'Lancôme',
    category: 'femenino',
    subcategory: 'Eau de Parfum',
    price: 780000,
    priceOld: null,
    ml: '75ml',
    description: 'Un himno a la belleza y la felicidad. Iris, praliné y vainilla gourmand construyen una fragancia dulce, femenina y absolutamente irresistible.',
    image: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=600&q=90',
    isNew: true,
    isBestseller: false,
    inStock: true,
    rating: 4.7,
    reviews: 189
  },
  {
    slug: 'valentino-donna-born-in-roma',
    name: 'Donna Born in Roma',
    brand: 'Valentino',
    category: 'femenino',
    subcategory: 'Eau de Parfum',
    price: 920000,
    priceOld: null,
    ml: '100ml',
    description: 'Nacida en la eterna ciudad, esta fragancia fusiona vainilla borbónica, jaspe y jazmín en una composición audaz e irresistiblemente moderna.',
    image: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    isNew: false,
    isBestseller: false,
    inStock: true,
    rating: 4.6,
    reviews: 143
  },
  {
    slug: 'jo-malone-lime-basil',
    name: 'Lime Basil & Mandarin',
    brand: 'Jo Malone London',
    category: 'unisex',
    subcategory: 'Colonia',
    price: 1080000,
    priceOld: null,
    ml: '100ml',
    description: 'Un aroma extraordinariamente fresco y verde. Lima zesty, albahaca picante y mandarina sobre un fondo de madera ambarada. Un clásico moderno.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.8,
    reviews: 221
  },
  {
    slug: 'replica-jazz-club',
    name: 'Jazz Club',
    brand: 'Maison Margiela',
    category: 'unisex',
    subcategory: 'Eau de Toilette',
    price: 1200000,
    priceOld: null,
    ml: '100ml',
    description: 'El aroma de un club de jazz en la noche. Ron, tabaco, vainilla y madera construyen una atmósfera cálida, evocadora e inimitable. Arte olfativo puro.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90',
    isNew: true,
    isBestseller: false,
    inStock: true,
    rating: 4.9,
    reviews: 167
  },
  {
    slug: 'la-mer-creme',
    name: 'Crème de la Mer',
    brand: 'La Mer',
    category: 'cuidado',
    subcategory: 'Crema Facial',
    price: 2150000,
    priceOld: null,
    ml: '60ml',
    description: 'La crema más legendaria del mundo del lujo. El Miracle Broth™ concentrado transforma la piel renovando su textura, hidratación y luminosidad de forma visible.',
    image: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.9,
    reviews: 534
  },
  {
    slug: 'skii-pitera-essence',
    name: 'Facial Treatment Essence',
    brand: 'SK-II',
    category: 'cuidado',
    subcategory: 'Esencia Facial',
    price: 1680000,
    priceOld: 1900000,
    ml: '230ml',
    description: 'La esencia más amada de Asia. Pitera™, un bioingrediente natural extraordinario, minimiza poros, ilumina y afina la textura en solo 4 semanas.',
    image: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    imageFallback: 'https://images.unsplash.com/photo-1590156562745-3a2fe77e5781?w=600&q=90',
    isNew: false,
    isBestseller: true,
    inStock: true,
    rating: 4.8,
    reviews: 389
  }
];

async function main() {
  console.log('Seeding products to Supabase...');

  // 1. Delete all existing records (optional, ensures clean state)
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('slug', '');

  if (deleteError) {
    console.error('Error clearing products table:', deleteError.message);
    process.exit(1);
  }

  console.log('Cleared existing products.');

  // 2. Insert new records
  const { data, error: insertError } = await supabase
    .from('products')
    .insert(productsToSeed)
    .select();

  if (insertError) {
    console.error('Error seeding products:', insertError.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} products to Supabase!`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
