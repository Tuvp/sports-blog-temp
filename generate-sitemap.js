#!/usr/bin/env node
/**
 * Generate sitemap.xml from articles.js
 * Extracts id lines from the JavaScript file
 */

const fs = require('fs');

// Read articles.js raw
const content = fs.readFileSync('articles.js', 'utf8');

// Extract all id values: match "id: "something"" or id: 'something'
const idMatches = content.match(/id:\s*["']([^"']+)["']/g);

if (!idMatches || idMatches.length === 0) {
  console.error('No articles found');
  process.exit(1);
}

// Build sitemap
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Homepage
xml += '  <url>\n';
xml += '    <loc>https://tuvp.in/</loc>\n';
xml += '    <priority>1.0</priority>\n';
xml += '  </url>\n';

// Articles (newest first, slight priority decay)
idMatches.forEach((match, i) => {
  const id = match.replace(/id:\s*["']/, '').replace(/["']$/, '');
  xml += '  <url>\n';
  xml += `    <loc>https://tuvp.in/article/${id}/</loc>\n`;
  xml += `    <priority>${(0.8 - (i * 0.02)).toFixed(2)}</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml);
console.log(`✓ Generated sitemap.xml with ${idMatches.length} articles`);
