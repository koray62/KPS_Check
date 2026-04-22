/**
 * lib/kps.js — NVI KPS SOAP client
 */

const ENDPOINT   = process.env.KPS_ENDPOINT   || 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx';
const TIMEOUT_MS = parseInt(process.env.KPS_TIMEOUT_MS || '8000', 10);

export async function callKPS({ tc, ad, soyad, dogumYili }) {
  const body = buildEnvelope({ tc, ad, soyad, dogumYili });
  const t0   = Date.now();

  const ctrl    = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method:  'POST',
      signal:  ctrl.signal,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction':   '"http://tckimlik.nvi.gov.tr/Service/TCKimlikNoDogrula"',
      },
      body,
    });
  } catch (err) {
    // Network error or timeout
    const msg = err.name === 'AbortError' ? 'KPS bağlantısı zaman aşımına uğradı.' : `Ağ hatası: ${err.message}`;
    throw new Error(msg);
  } finally {
    clearTimeout(timeout);
  }

  const xml = await response.text();
  const durationMs = Date.now() - t0;

  if (!response.ok) {
    // Return first 300 chars of body so we can debug
    throw new Error(`KPS HTTP ${response.status} — ${xml.slice(0, 300)}`);
  }

  return { ...parseResponse(xml, response.status), durationMs };
}

function buildEnvelope({ tc, ad, soyad, dogumYili }) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/Service">
      <TCKimlikNo>${x(tc)}</TCKimlikNo>
      <Ad>${x(ad)}</Ad>
      <Soyad>${x(soyad)}</Soyad>
      <DogumYili>${dogumYili}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>`;
}

function parseResponse(xml, httpStatus) {
  // Happy path
  const m = xml.match(/<TCKimlikNoDogrulaResult[^>]*>(true|false)<\/TCKimlikNoDogrulaResult>/i);
  if (m) return { verified: m[1].toLowerCase() === 'true' };

  // SOAP fault
  const fault = xml.match(/<faultstring>(.*?)<\/faultstring>/i)?.[1];
  if (fault) throw new Error(`NVI SOAP Fault: ${fault}`);

  // Unknown — expose first 300 chars so Vercel logs show what NVI actually returned
  throw new Error(`NVI yanıtı parse edilemedi (HTTP ${httpStatus}): ${xml.slice(0, 300)}`);
}

function x(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
