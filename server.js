/**
 * server.js — KPS Identity Verification · REST API + Dashboard
 * Vercel-compatible: HTML served via route, app exported as default
 */

import express    from 'express';
import rateLimit  from 'express-rate-limit';
import helmet     from 'helmet';
import fs         from 'fs';
import path       from 'path';
import { fileURLToPath } from 'url';
import { validateTCKN, tcknDetails } from './lib/tckn.js';
import { callKPS }          from './lib/kps.js';
import { auditLog, maskTc } from './lib/audit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use('/api', rateLimit({
  windowMs: 60_000, max: 60,
  message: { success:false, error:'TOO_MANY_REQUESTS', message:'Dakikada en fazla 60 istek.' }
}));

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  if (!key || key !== process.env.API_KEY)
    return res.status(401).json({ success:false, error:'UNAUTHORIZED', message:'Geçersiz API anahtarı.' });
  next();
}

// Dashboard
app.get('/', (_req, res) => res.setHeader('Content-Type','text/html').send(DASHBOARD));

// Health
app.get('/health', (_req, res) => res.json({ status:'ok', ts: new Date().toISOString() }));

// POST /api/verify
app.post('/api/verify', requireApiKey, async (req, res) => {
  const { tc, ad, soyad, dogumYili } = req.body;
  const requestId = crypto.randomUUID();
  const clientIp  = req.ip;

  const errs = [];
  if (!tc || !/^\d{11}$/.test(String(tc)))                 errs.push('tc: 11 haneli sayısal değer olmalıdır.');
  if (!ad    || typeof ad    !== 'string' || !ad.trim())    errs.push('ad: zorunlu.');
  if (!soyad || typeof soyad !== 'string' || !soyad.trim()) errs.push('soyad: zorunlu.');
  const yr = Number(dogumYili);
  if (!dogumYili || isNaN(yr) || yr < 1900 || yr > new Date().getFullYear())
    errs.push('dogumYili: geçerli bir yıl giriniz.');

  if (errs.length)
    return res.status(400).json({ success:false, error:'VALIDATION_ERROR', details:errs, requestId });

  const checksumValid = validateTCKN(tc);
  if (!checksumValid) {
    await auditLog({ requestId, clientIp, tc:maskTc(tc), action:'VERIFY', result:'CHECKSUM_FAIL' });
    return res.json({ success:true, verified:false, checksumValid:false, details:tcknDetails(tc), requestId,
      message:'Checksum geçersiz — NVI sorgusu yapılmadı.' });
  }

  try {
    const kps = await callKPS({
      tc, dogumYili: yr,
      ad:    ad.toLocaleUpperCase('tr-TR').trim(),
      soyad: soyad.toLocaleUpperCase('tr-TR').trim(),
    });
    await auditLog({ requestId, clientIp, tc:maskTc(tc), action:'KPS_VERIFY',
      result: kps.verified?'VERIFIED':'NOT_VERIFIED', durationMs:kps.durationMs });
    return res.json({ success:true, verified:kps.verified, checksumValid:true, durationMs:kps.durationMs, requestId });
  } catch (err) {
    await auditLog({ requestId, clientIp, tc:maskTc(tc), action:'KPS_VERIFY', result:'ERROR', error:err.message });
    return res.status(502).json({ success:false, error:'KPS_UNAVAILABLE',
      message:'NVI servisi yanıt vermedi. Lütfen tekrar deneyin.', requestId });
  }
});

// POST /api/verify/batch
app.post('/api/verify/batch', requireApiKey, async (req, res) => {
  const { records } = req.body;
  const requestId = crypto.randomUUID();

  if (!Array.isArray(records) || records.length === 0 || records.length > 20)
    return res.status(400).json({ success:false, error:'VALIDATION_ERROR',
      message:'records dizisi 1-20 eleman içermelidir.', requestId });

  const results = await Promise.allSettled(records.map(async (r, index) => {
    const checksumValid = validateTCKN(String(r.tc||''));
    if (!checksumValid) return { index, tc:maskTc(String(r.tc||'')), verified:false, checksumValid:false };
    const kps = await callKPS({
      tc: r.tc, dogumYili: Number(r.dogumYili),
      ad:    (r.ad   ||'').toLocaleUpperCase('tr-TR').trim(),
      soyad: (r.soyad||'').toLocaleUpperCase('tr-TR').trim(),
    });
    return { index, tc:maskTc(r.tc), verified:kps.verified, checksumValid:true, durationMs:kps.durationMs };
  }));

  await auditLog({ requestId, clientIp:req.ip, action:'BATCH_VERIFY', count:records.length });
  return res.json({ success:true, requestId, total:records.length,
    results: results.map(r => r.status==='fulfilled' ? r.value : { error:r.reason?.message }) });
});

// Local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✓ KPS API + Dashboard → http://localhost:${PORT}`));
}

export default app;
