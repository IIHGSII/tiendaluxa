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

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

fetch(process.env.SUPABASE_URL)
  .then(res => console.log('Fetch succeeded, status:', res.status))
  .catch(err => {
    console.error('Fetch failed details:');
    console.error(err);
    if (err.cause) {
      console.error('Cause details:');
      console.error(err.cause);
    }
  });
