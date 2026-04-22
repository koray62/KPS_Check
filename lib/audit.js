/**
 * lib/audit.js
 * KVKK-uyumlu append-only JSONL audit log
 * TC kimlik no maskelenmiş olarak yazılır (ilk 3 + son 2 hane görünür)
 */
import fs from 'fs/promises';
import path from 'path';

const LOG_DIR  = process.env.LOG_DIR  || './logs';
const LOG_FILE = path.join(LOG_DIR, 'audit.jsonl');

export async function auditLog(entry) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n', 'utf8');
  } catch (err) {
    console.error('[audit]', err.message);
  }
}

export function maskTc(tc) {
  if (!tc || tc.length < 5) return '***';
  return tc.slice(0,3) + '*'.repeat(6) + tc.slice(-2);
}
