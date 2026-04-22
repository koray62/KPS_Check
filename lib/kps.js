/**
 * lib/kps.js
 * NVI KPS SOAP client — TCKimlikNoDogrula
 *
 * Endpoint : https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx
 * WSDL     : https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL
 *
 * Erişim koşulları:
 *   - Sunucu statik IP'si NVI tarafından whitelist'e alınmış olmalı
 *   - NVI ile kurumsal sözleşme gerekli
 */

const ENDPOINT   = process.env.KPS_ENDPOINT   || 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx';
const TIMEOUT_MS = parseInt(process.env.KPS_TIMEOUT_MS || '8000', 10);

/**
 * @param {{ tc:string, ad:string, soyad:string, dogumYili:number }} p
 * @returns {Promise<{ verified:boolean, durationMs:number }>}
 */
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
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) throw new Error(`KPS HTTP ${response.status}`);

  const xml = await response.text();
  const durationMs = Date.now() - t0;
  return { ...parseResponse(xml), durationMs };
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

function parseResponse(xml) {
  const m = xml.match(/<TCKimlikNoDogrulaResult[^>]*>(true|false)<\/TCKimlikNoDogrulaResult>/i);
  if (!m) {
    const fault = xml.match(/<faultstring>(.*?)<\/faultstring>/)?.[1];
    throw new Error(fault ? `SOAP Fault: ${fault}` : 'KPS yanıtı beklenmeyen formatta.');
  }
  return { verified: m[1].toLowerCase() === 'true' };
}

function x(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
