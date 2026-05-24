import fs from "fs";
import https from "https";

const fetchSvg = (slug) => new Promise((resolve) => {
  https.get(`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${slug}.svg`, (res) => {
    if (res.statusCode !== 200) {
      resolve(null);
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', () => resolve(null));
});

const file = 'src/lib/linkIcons.ts';
let content = fs.readFileSync(file, 'utf8');

// Match everything inside LINK_ICONS
const regex = /export const LINK_ICONS: LinkIcon\[\] = \[\s*([\s\S]*?)\s*\];/;
const match = content.match(regex);
if (!match) process.exit(1);

const iconItems = match[1].split(/\n/).filter(line => line.includes('{ id:'));

const mapSlug = {
  'apple-music': 'applemusic', 'aws': 'amazonaws', 'disneyplus': 'disneyplus', 'amazonprime': 'primevideo',
  'googledrive': 'googledrive', 'hackernews': 'ycombinator', 'buy-me-coffee': 'buymeacoffee',
  'bitchute': 'bitchute', 'dlive': 'dlive', 'kickstarter': 'kickstarter', 'ko-fi': 'kofi', 'onedrive': 'microsoftonedrive'
};

async function processIcons() {
  const seenIds = new Set();
  const finalLines = [];
  
  for (let line of iconItems) {
    const idMatch = line.match(/id:"([^"]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    
    // remove duplicates ending in 2
    if (id.match(/2$/)) continue;
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    // If it's the dummy circle, replace it
    if (line.includes('M12 2C6.48')) {
      const slug = mapSlug[id] || id;
      const raw = await fetchSvg(slug);
      
      let pValue = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z';
      if (raw) {
        const pathMatch = raw.match(/<path d="([^"]+)"/);
        if (pathMatch) pValue = pathMatch[1];
      }
      
      line = line.replace(/svg:(p\("[^"]+"\)|`[^`]+`|"[^"]+")/, `svg:p("${pValue}")`);
      console.log('Updated ' + id);
    }
    
    finalLines.push(line);
  }
  
  const newArray = `export const LINK_ICONS: LinkIcon[] = [\n${finalLines.join('\n')}\n];`;
  content = content.replace(regex, newArray);
  fs.writeFileSync(file, content);
  console.log('Saved linkIcons.ts!');
}

processIcons();
