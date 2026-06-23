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
  console.log('Testing upsert onConflict id...');
  
  // Let's get one product first to get its ID
  const { data: products } = await supabase.from('products').select('*').limit(1);
  if (!products || products.length === 0) {
    console.log('No products to test with.');
    process.exit(0);
  }
  
  const original = products[0];
  console.log('Original product:', original.id, original.name, original.price);
  
  const updatedItem = {
    ...original,
    price: original.price + 1 // increment price
  };
  
  const { data, error } = await supabase.from('products').upsert([updatedItem], { onConflict: 'id' }).select();
  if (error) {
    console.error('Upsert on id failed:', error);
  } else {
    console.log('Upsert on id succeeded, new price:', data[0].price);
    
    // Revert
    console.log('Reverting...');
    await supabase.from('products').upsert([original], { onConflict: 'id' });
    console.log('Reverted.');
  }
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
