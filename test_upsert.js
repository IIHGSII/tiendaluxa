const fs = require('fs');
const path = require('path');

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

const supabase = require('./db.js');

async function test() {
  console.log('Testing upsert with onConflict codigo_item_proveedor...');
  const { data, error } = await supabase.from('products').upsert(
    [
      {
        slug: 'test-upsert-1',
        name: 'Test Upsert 1',
        brand: 'Sin marca',
        category: 'unisex',
        price: 10000,
        codigo_item_proveedor: 'UPSERT_TEST'
      }
    ],
    { onConflict: 'codigo_item_proveedor' }
  ).select();

  if (error) {
    console.error('Upsert failed:', error);
  } else {
    console.log('Upsert succeeded:', data);
    
    // Clean up
    console.log('Cleaning up...');
    await supabase.from('products').delete().eq('codigo_item_proveedor', 'UPSERT_TEST');
    console.log('Cleaned.');
  }
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
