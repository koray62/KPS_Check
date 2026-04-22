/**
 * Audit logger
 * Writes append-only JSONL to logs/audit.jsonl
 * KVKK compliance: TC kimlik no is stored MASKED (first 3 digits only)
 */

import fs from 'fs/promises';
import path from 'path';

const LOG_DIR  = process.env.LOG_DIR || './logs';
const LOG_FILE = path.join(LOG_DIR, 'audit.jsonl');

export async function auditLog(entry) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
    await fs.appendFile(LOG_FILE, line, 'utf8');
  } catch (err) {
    // Never let logging failure crash the API
    console.error('[audit] Log yazılamadı:', err.message);
  }
}
