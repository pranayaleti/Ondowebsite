/**
 * Document reader module for AI chat assistant.
 * Reads documentation files from docs/ folder and provides them for AI context.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to docs folder (from backend/services/ -> docs/)
const DOCS_DIR = path.join(__dirname, '../../docs');

// In-memory cache for docs
let docsCache = null;
let cacheTimestamp = null;

/**
 * Read all markdown files from the docs/ folder.
 * @returns {Promise<Object<string, string>>} Object mapping filename to content
 */
export async function readAllDocs() {
  // Return cached docs if available
  if (docsCache !== null) {
    return docsCache;
  }

  const docs = {};
  
  try {
    // Check if docs directory exists
    if (!fs.existsSync(DOCS_DIR)) {
      console.warn(`⚠️  Docs directory not found: ${DOCS_DIR}`);
      return docs;
    }

    // Read all files in docs directory
    const files = fs.readdirSync(DOCS_DIR);
    
    // Filter for markdown files
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    if (mdFiles.length === 0) {
      console.warn(`⚠️  No markdown files found in ${DOCS_DIR}`);
      return docs;
    }

    // Read each markdown file
    for (const file of mdFiles) {
      try {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        docs[file] = content;
      } catch (err) {
        console.error(`❌ Error reading doc file ${file}:`, err.message);
        // Continue with other files even if one fails
      }
    }

    // Cache the results
    docsCache = docs;
    cacheTimestamp = Date.now();
    
    console.log(`✅ Loaded ${Object.keys(docs).length} documentation files`);
    
  } catch (err) {
    console.error('❌ Error reading docs directory:', err.message);
    // Return empty object on error, allowing fallback behavior
  }

  return docs;
}

/**
 * Get content of a specific documentation file.
 * @param {string} filename - Name of the file (e.g., 'pricing.md')
 * @returns {Promise<string|null>} File content or null if not found
 */
export async function getDocContent(filename) {
  const allDocs = await readAllDocs();
  return allDocs[filename] || null;
}

/**
 * Format documentation content for inclusion in AI prompt.
 * @param {Object<string, string>} docs - Object mapping filename to content
 * @returns {string} Formatted string for prompt
 */
export function formatDocsForPrompt(docs) {
  if (!docs || Object.keys(docs).length === 0) {
    return '';
  }

  let formatted = '\n\nDOCUMENTATION:\n\n';
  
  // Sort files alphabetically for consistent ordering
  const sortedFiles = Object.keys(docs).sort();
  
  for (const filename of sortedFiles) {
    const content = docs[filename];
    formatted += `=== ${filename} ===\n${content}\n\n`;
  }
  
  return formatted;
}

/**
 * Clear the docs cache (useful for testing or refreshing docs).
 */
export function clearCache() {
  docsCache = null;
  cacheTimestamp = null;
}

/**
 * Get cache timestamp (useful for debugging).
 * @returns {number|null} Timestamp when cache was created, or null if not cached
 */
export function getCacheTimestamp() {
  return cacheTimestamp;
}
